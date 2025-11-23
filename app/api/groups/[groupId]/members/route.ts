import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { groupMembers, users } from "@/lib/db/schema";
import { auth } from "@/auth";
import { createErrorResponse } from "@/lib/validation";
import { eq, and } from "drizzle-orm";

// GET - Get group members
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ groupId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return createErrorResponse("Unauthorized", 401);
        }

        const { groupId } = await params;

        // Verify user is a member
        const [userMember] = await db
            .select()
            .from(groupMembers)
            .where(
                and(
                    eq(groupMembers.groupId, groupId),
                    eq(groupMembers.userId, session.user.id)
                )
            );

        if (!userMember) {
            return createErrorResponse("You must be a member to view members", 403);
        }

        // Fetch all members with user info
        const members = await db
            .select({
                groupId: groupMembers.groupId,
                userId: groupMembers.userId,
                role: groupMembers.role,
                joinedAt: groupMembers.joinedAt,
                lastReadAt: groupMembers.lastReadAt,
                isOnline: groupMembers.isOnline,
                lastSeenAt: groupMembers.lastSeenAt,
                userName: users.name,
                userEmail: users.email,
                userImage: users.image,
            })
            .from(groupMembers)
            .innerJoin(users, eq(groupMembers.userId, users.id))
            .where(eq(groupMembers.groupId, groupId));

        // Transform to include user object
        const transformedMembers = members.map((m) => ({
            groupId: m.groupId,
            userId: m.userId,
            role: m.role,
            joinedAt: m.joinedAt,
            lastReadAt: m.lastReadAt,
            isOnline: m.isOnline,
            lastSeenAt: m.lastSeenAt,
            user: {
                id: m.userId,
                name: m.userName,
                email: m.userEmail,
                image: m.userImage,
            },
        }));

        return NextResponse.json({
            members: transformedMembers,
            count: transformedMembers.length,
        });
    } catch (error) {
        console.error("Error fetching members:", error);
        return createErrorResponse("Failed to fetch members", 500);
    }
}
