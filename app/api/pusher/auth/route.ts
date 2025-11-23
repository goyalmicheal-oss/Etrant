import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPusherServer } from "@/lib/pusher/server";
import { createErrorResponse } from "@/lib/validation";

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return createErrorResponse("Unauthorized", 401);
        }

        const body = await request.text();
        const params = new URLSearchParams(body);
        const socketId = params.get("socket_id");
        const channelName = params.get("channel_name");

        if (!socketId || !channelName) {
            return createErrorResponse("Missing socket_id or channel_name");
        }

        const pusher = getPusherServer();

        // Authorize the user for the channel
        const authResponse = pusher.authorizeChannel(socketId, channelName, {
            user_id: session.user.id,
            user_info: {
                name: session.user.name,
                image: session.user.image,
            },
        });

        return NextResponse.json(authResponse);
    } catch (error) {
        console.error("Pusher auth error:", error);
        return createErrorResponse("Authentication failed", 500);
    }
}
