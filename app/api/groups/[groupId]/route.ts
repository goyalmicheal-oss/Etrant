import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { examGroups, groupMembers } from "@/lib/db/schema";
import { auth } from "@/auth";
import { createErrorResponse } from "@/lib/validation";
import { eq, and } from "drizzle-orm";

// GET - Get group details
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

        // Fetch group details
        const [group] = await db
            .select()
            .from(examGroups)
            .where(eq(examGroups.id, groupId));

        if (!group) {
            return createErrorResponse("Group not found", 404);
        }

        // Check if user is a member
        const [member] = await db
            .select()
            .from(groupMembers)
            .where(
                and(
                    eq(groupMembers.groupId, groupId),
                    eq(groupMembers.userId, session.user.id)
                )
            );

        if (!member && !group.isPublic) {
            return createErrorResponse("Access denied", 403);
        }

        return NextResponse.json({
            group,
            isMember: !!member,
            memberRole: member?.role,
        });
    } catch (error) {
        console.error("Error fetching group:", error);
        return createErrorResponse("Failed to fetch group", 500);
    }
}
