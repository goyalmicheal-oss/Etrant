/**
 * Pusher Server Configuration
 * Used for sending real-time events from the server
 */

import Pusher from 'pusher';

let pusherServer: Pusher | null = null;

export function getPusherServer(): Pusher {
    if (!pusherServer) {
        if (!process.env.PUSHER_APP_ID ||
            !process.env.PUSHER_KEY ||
            !process.env.PUSHER_SECRET ||
            !process.env.PUSHER_CLUSTER) {
            throw new Error(
                'Missing Pusher environment variables. Please set PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, and PUSHER_CLUSTER'
            );
        }

        pusherServer = new Pusher({
            appId: process.env.PUSHER_APP_ID,
            key: process.env.PUSHER_KEY,
            secret: process.env.PUSHER_SECRET,
            cluster: process.env.PUSHER_CLUSTER,
            useTLS: true,
        });
    }

    return pusherServer;
}

/**
 * Trigger a message event in a group channel
 */
export async function triggerGroupMessage(
    groupId: string,
    eventName: string,
    data: any
) {
    const pusher = getPusherServer();

    try {
        await pusher.trigger(`group-${groupId}`, eventName, data);
    } catch (error) {
        console.error('Error triggering Pusher event:', error);
        throw error;
    }
}

/**
 * Trigger typing indicator
 */
export async function triggerTypingIndicator(
    groupId: string,
    userId: string,
    userName: string,
    isTyping: boolean
) {
    const pusher = getPusherServer();

    try {
        await pusher.trigger(`group-${groupId}`, 'typing', {
            userId,
            userName,
            isTyping,
        });
    } catch (error) {
        console.error('Error triggering typing indicator:', error);
    }
}

/**
 * Trigger user online/offline status
 */
export async function triggerUserStatus(
    groupId: string,
    userId: string,
    isOnline: boolean
) {
    const pusher = getPusherServer();

    try {
        await pusher.trigger(`group-${groupId}`, 'user-status', {
            userId,
            isOnline,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error triggering user status:', error);
    }
}

/**
 * Pusher event names
 */
export const PUSHER_EVENTS = {
    NEW_MESSAGE: 'new-message',
    MESSAGE_UPDATED: 'message-updated',
    MESSAGE_DELETED: 'message-deleted',
    TYPING: 'typing',
    USER_STATUS: 'user-status',
    MEMBER_JOINED: 'member-joined',
    MEMBER_LEFT: 'member-left',
} as const;
