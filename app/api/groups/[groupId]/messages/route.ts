import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { groupMessages, groupMembers, users } from "@/lib/db/schema";
import { auth } from "@/auth";
import { rateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import { createErrorResponse, sanitizeString } from "@/lib/validation";
import { eq, and, desc } from "drizzle-orm";
import { triggerGroupMessage, PUSHER_EVENTS } from "@/lib/pusher/server";
import type { SendMessageInput } from "@/types/groups";

const messageRateLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 messages per minute
});

// GET - Fetch messages for a group
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
        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
        const offset = parseInt(searchParams.get("offset") || "0");

        // Verify user is a member
        const [member] = await db
            .select()
            .from(groupMembers)
            .where(
                and(
                    eq(groupMembers.groupId, groupId),
                    eq(groupMembers.userId, session.user.id)
                )
            );

        if (!member) {
            return createErrorResponse("You must be a member to view messages", 403);
        }

        // Fetch messages with user info
        const messages = await db
            .select({
                id: groupMessages.id,
                groupId: groupMessages.groupId,
                userId: groupMessages.userId,
                content: groupMessages.content,
                messageType: groupMessages.messageType,
                fileUrl: groupMessages.fileUrl,
                fileName: groupMessages.fileName,
                replyToId: groupMessages.replyToId,
                reactions: groupMessages.reactions,
                isEdited: groupMessages.isEdited,
                isDeleted: groupMessages.isDeleted,
                createdAt: groupMessages.createdAt,
                updatedAt: groupMessages.updatedAt,
                userName: users.name,
                userImage: users.image,
            })
            .from(groupMessages)
            .innerJoin(users, eq(groupMessages.userId, users.id))
            .where(
                and(
                    eq(groupMessages.groupId, groupId),
                    eq(groupMessages.isDeleted, false)
                )
            )
            .orderBy(desc(groupMessages.createdAt))
            .limit(limit)
            .offset(offset);

        // Update last read timestamp
        await db
            .update(groupMembers)
            .set({ lastReadAt: new Date() })
            .where(
                and(
                    eq(groupMembers.groupId, groupId),
                    eq(groupMembers.userId, session.user.id)
                )
            );

        return NextResponse.json({
            messages: messages.reverse(), // Reverse to show oldest first
            count: messages.length,
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return createErrorResponse("Failed to fetch messages", 500);
    }
}

// POST - Send a message
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ groupId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return createErrorResponse("Unauthorized", 401);
        }

        // Rate limiting
        const rateLimitResponse = messageRateLimit(session.user.id);
        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        const { groupId } = await params;
        const body: SendMessageInput = await request.json();

        // Validate content
        if (!body.content || body.content.trim().length === 0) {
            return createErrorResponse("Message content is required");
        }

        if (body.content.length > 5000) {
            return createErrorResponse("Message is too long (max 5000 characters)");
        }

        // Verify user is a member
        const [member] = await db
            .select()
            .from(groupMembers)
            .where(
                and(
                    eq(groupMembers.groupId, groupId),
                    eq(groupMembers.userId, session.user.id)
                )
            );

        if (!member) {
            return createErrorResponse("You must be a member to send messages", 403);
        }

        // Sanitize content
        const sanitizedContent = sanitizeString(body.content);

        // Create message
        const [newMessage] = await db
            .insert(groupMessages)
            .values({
                groupId,
                userId: session.user.id,
                content: sanitizedContent,
                messageType: body.messageType || "text",
                fileUrl: body.fileUrl,
                fileName: body.fileName,
                replyToId: body.replyToId,
            })
            .returning();

        // Prepare message with user info for real-time broadcast
        const messageWithUser = {
            ...newMessage,
            user: {
                id: session.user.id,
                name: session.user.name,
                image: session.user.image,
            },
        };

        // Trigger real-time event
        try {
            await triggerGroupMessage(groupId, PUSHER_EVENTS.NEW_MESSAGE, messageWithUser);
        } catch (error) {
            console.error("Error triggering Pusher event:", error);
            // Don't fail the request if Pusher fails
        }

        return NextResponse.json(
            { message: messageWithUser, success: true },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error sending message:", error);
        return createErrorResponse("Failed to send message", 500);
    }
}
