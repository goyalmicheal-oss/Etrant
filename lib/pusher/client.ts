/**
 * Pusher Client Configuration
 * Used for receiving real-time events in the browser
 */

import PusherClient from 'pusher-js';

let pusherClient: PusherClient | null = null;

export function getPusherClient(): PusherClient {
    if (!pusherClient) {
        if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
            throw new Error(
                'Missing Pusher client environment variables. Please set NEXT_PUBLIC_PUSHER_KEY and NEXT_PUBLIC_PUSHER_CLUSTER'
            );
        }

        pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
            authEndpoint: '/api/pusher/auth',
            auth: {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        });

        // Connection state logging (development only)
        if (process.env.NODE_ENV === 'development') {
            pusherClient.connection.bind('connected', () => {
                console.log('✅ Pusher connected');
            });

            pusherClient.connection.bind('disconnected', () => {
                console.log('❌ Pusher disconnected');
            });

            pusherClient.connection.bind('error', (error: any) => {
                console.error('Pusher error:', error);
            });
        }
    }

    return pusherClient;
}

/**
 * Subscribe to a group channel
 */
export function subscribeToGroup(groupId: string) {
    const pusher = getPusherClient();
    return pusher.subscribe(`group-${groupId}`);
}

/**
 * Unsubscribe from a group channel
 */
export function unsubscribeFromGroup(groupId: string) {
    const pusher = getPusherClient();
    pusher.unsubscribe(`group-${groupId}`);
}

/**
 * Disconnect Pusher client
 */
export function disconnectPusher() {
    if (pusherClient) {
        pusherClient.disconnect();
        pusherClient = null;
    }
}
