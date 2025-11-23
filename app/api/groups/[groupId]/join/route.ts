import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { examGroups, groupMembers } from "@/lib/db/schema";
import { auth } from "@/auth";
import { createErrorResponse } from "@/lib/validation";
import { eq, and, sql } from "drizzle-orm";
import { triggerGroupMessage, PUSHER_EVENTS } from "@/lib/pusher/server";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ groupId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return createErrorResponse("Unauthorized", 401);
        }

        const { groupId } = await params;

        // Check if group exists
        const [group] = await db
            .select()
            .from(examGroups)
            .where(eq(examGroups.id, groupId));

        if (!group) {
            return createErrorResponse("Group not found", 404);
        }

        // Check if group is full
        if (group.maxMembers && group.memberCount && group.memberCount >= group.maxMembers) {
            return createErrorResponse("Group is full", 400);
        }

        // Check if user is already a member
        const [existingMember] = await db
            .select()
            .from(groupMembers)
            .where(
                and(
                    eq(groupMembers.groupId, groupId),
                    eq(groupMembers.userId, session.user.id)
                )
            );

        if (existingMember) {
            return createErrorResponse("Already a member of this group", 400);
        }

        // Add user to group
        await db.insert(groupMembers).values({
            groupId,
            userId: session.user.id,
            role: "member",
        });

        // Update member count
        await db
            .update(examGroups)
            .set({
                memberCount: sql`${examGroups.memberCount} + 1`,
                lastActivityAt: new Date(),
            })
            .where(eq(examGroups.id, groupId));

        // Trigger real-time event
        try {
            await triggerGroupMessage(groupId, PUSHER_EVENTS.MEMBER_JOINED, {
                userId: session.user.id,
                userName: session.user.name,
                userImage: session.user.image,
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            console.error("Error triggering Pusher event:", error);
            // Don't fail the request if Pusher fails
        }

        return NextResponse.json({
            success: true,
            message: "Successfully joined the group",
        });
    } catch (error) {
        console.error("Error joining group:", error);
        return createErrorResponse("Failed to join group", 500);
    }
}
