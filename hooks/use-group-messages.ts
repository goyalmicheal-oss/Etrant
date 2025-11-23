'use client';

import { useEffect, useState, useCallback } from 'react';
import { subscribeToGroup, unsubscribeFromGroup } from '@/lib/pusher/client';
import { PUSHER_EVENTS } from '@/lib/pusher/server';
import type { GroupMessage } from '@/types/groups';

interface UseGroupMessagesOptions {
    groupId: string;
    initialMessages?: GroupMessage[];
    enabled?: boolean;
}

export function useGroupMessages({
    groupId,
    initialMessages = [],
    enabled = true,
}: UseGroupMessagesOptions) {
    const [messages, setMessages] = useState<GroupMessage[]>(initialMessages);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch messages
    const fetchMessages = useCallback(async (offset = 0) => {
        if (!enabled) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/api/groups/${groupId}/messages?limit=50&offset=${offset}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }

            const data = await response.json();

            if (offset === 0) {
                setMessages(data.messages);
            } else {
                setMessages((prev) => [...data.messages, ...prev]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch messages');
        } finally {
            setIsLoading(false);
        }
    }, [groupId, enabled]);

    // Send message
    const sendMessage = useCallback(
        async (content: string, replyToId?: string) => {
            if (!content.trim()) return;

            try {
                const response = await fetch(`/api/groups/${groupId}/messages`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        groupId,
                        content: content.trim(),
                        replyToId,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to send message');
                }

                const data = await response.json();

                // Optimistically add message (will be replaced by real-time event)
                setMessages((prev) => [...prev, data.message]);

                return data.message;
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to send message');
                throw err;
            }
        },
        [groupId]
    );

    // Subscribe to real-time updates
    useEffect(() => {
        if (!enabled || !groupId) return;

        const channel = subscribeToGroup(groupId);

        // Handle new messages
        channel.bind(PUSHER_EVENTS.NEW_MESSAGE, (message: GroupMessage) => {
            setMessages((prev) => {
                // Avoid duplicates
                if (prev.some((m) => m.id === message.id)) {
                    return prev;
                }
                return [...prev, message];
            });
        });

        // Handle message updates
        channel.bind(PUSHER_EVENTS.MESSAGE_UPDATED, (updatedMessage: GroupMessage) => {
            setMessages((prev) =>
                prev.map((m) => (m.id === updatedMessage.id ? updatedMessage : m))
            );
        });

        // Handle message deletions
        channel.bind(PUSHER_EVENTS.MESSAGE_DELETED, ({ messageId }: { messageId: string }) => {
            setMessages((prev) => prev.filter((m) => m.id !== messageId));
        });

        return () => {
            channel.unbind_all();
            unsubscribeFromGroup(groupId);
        };
    }, [groupId, enabled]);

    // Initial fetch
    useEffect(() => {
        if (enabled && messages.length === 0) {
            fetchMessages();
        }
    }, [enabled, fetchMessages, messages.length]);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        fetchMessages,
        refetch: () => fetchMessages(0),
    };
}
