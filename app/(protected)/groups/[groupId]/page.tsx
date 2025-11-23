'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Send, Users, Loader2, Info, Search, Paperclip, Smile } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useGroupMessages } from '@/hooks/use-group-messages';
import { format, isSameDay, formatDistanceToNow } from 'date-fns';
import type { ExamGroup, GroupMember } from '@/types/groups';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function GroupChatPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const groupId = params.groupId as string;

    const [group, setGroup] = useState<ExamGroup | null>(null);
    const [members, setMembers] = useState<GroupMember[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [isLoadingGroup, setIsLoadingGroup] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Sidebar state
    const [myGroups, setMyGroups] = useState<ExamGroup[]>([]);
    const [groupSearchQuery, setGroupSearchQuery] = useState('');
    const [isLoadingMyGroups, setIsLoadingMyGroups] = useState(true);

    const { messages, isLoading, sendMessage } = useGroupMessages({
        groupId,
        enabled: !!groupId,
    });

    useEffect(() => {
        if (groupId) {
            fetchGroupDetails();
            fetchMembers();
        }
        fetchMyGroups();
    }, [groupId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchGroupDetails = async () => {
        try {
            const response = await fetch(`/api/groups/${groupId}`);
            if (!response.ok) {
                throw new Error('Group not found');
            }
            const data = await response.json();
            setGroup(data.group);
        } catch (error) {
            console.error('Error fetching group:', error);
            toast.error('Failed to load group');
            router.push('/groups');
        } finally {
            setIsLoadingGroup(false);
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await fetch(`/api/groups/${groupId}/members`);
            if (response.ok) {
                const data = await response.json();
                setMembers(data.members || []);
            }
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    const fetchMyGroups = async () => {
        setIsLoadingMyGroups(true);
        try {
            const params = new URLSearchParams();
            params.append('myGroups', 'true');
            if (groupSearchQuery) params.append('query', groupSearchQuery);

            const response = await fetch(`/api/groups?${params.toString()}`);
            const data = await response.json();
            setMyGroups(data.groups || []);
        } catch (error) {
            console.error('Error fetching my groups:', error);
        } finally {
            setIsLoadingMyGroups(false);
        }
    };

    // Debounce search for groups
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchMyGroups();
        }, 500);
        return () => clearTimeout(timer);
    }, [groupSearchQuery]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!messageInput.trim()) return;

        try {
            await sendMessage(messageInput.trim());
            setMessageInput('');
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    const getInitials = (name: string | null) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Generate a consistent color for a username
    const getUserColor = (name: string) => {
        const colors = [
            'text-red-500', 'text-orange-500', 'text-amber-500',
            'text-green-500', 'text-emerald-500', 'text-teal-500',
            'text-cyan-500', 'text-blue-500', 'text-indigo-500',
            'text-violet-500', 'text-purple-500', 'text-fuchsia-500',
            'text-pink-500', 'text-rose-500'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const filteredGroups = myGroups.filter(g =>
        g.name.toLowerCase().includes(groupSearchQuery.toLowerCase())
    );

    if (isLoadingGroup) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!group) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
                <h2 className="text-2xl font-bold mb-4">Group not found</h2>
                <Link href="/groups">
                    <Button>Back to Groups</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex max-md:h-[calc(100vh-64px)] max-md:mt-[64px] w-full bg-gray-100 dark:bg-gray-950 overflow-hidden">
            {/* Left Sidebar - Group List */}
            <div className="w-80 md:w-96 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col hidden md:flex">
                {/* Sidebar Header */}

                <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Chats</h2>
                        <div className="flex gap-2">
                            <Link href="/groups/create">
                                <Button variant="ghost" size="icon" title="Create Group">
                                    <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search groups..."
                            className="pl-9 bg-gray-100 dark:bg-gray-800 border-none focus-visible:ring-1"
                            value={groupSearchQuery}
                            onChange={(e) => setGroupSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Groups List */}
                <ScrollArea className="flex-1">
                    <div className="flex flex-col">
                        {isLoadingMyGroups ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            </div>
                        ) : filteredGroups.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                No groups found
                            </div>
                        ) : (
                            filteredGroups.map((g) => (
                                <Link
                                    key={g.id}
                                    href={`/groups/${g.id}`}
                                    className={cn(
                                        "flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-50 dark:border-gray-800/50 cursor-pointer",
                                        g.id === groupId && "bg-gray-100 dark:bg-gray-800"
                                    )}
                                >
                                    <Avatar className="w-12 h-12">
                                        <AvatarFallback className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 font-semibold">
                                            {getInitials(g.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                {g.name}
                                            </h3>
                                            <span className="text-[10px] text-gray-500">
                                                {g.lastActivityAt && formatDistanceToNow(new Date(g.lastActivityAt), { addSuffix: false })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                            {g.description || 'No description'}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Right Side - Chat Area */}
            <div className="flex-1 flex flex-col bg-[#efeae2] dark:bg-[#0b141a] relative">
                {/* Chat Background Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')]"></div>

                {/* Chat Header */}
                <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between z-10 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href="/groups" className="md:hidden">
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </Link>
                        <Avatar className="w-10 h-10 cursor-pointer border border-gray-200 dark:border-gray-700">
                            <AvatarFallback className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 font-semibold">
                                {getInitials(group.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="cursor-pointer">
                            <h1 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base">
                                {group.name}
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px] md:max-w-md">
                                {members.map(m => m.user?.name).filter(Boolean).slice(0, 3).join(', ')}
                                {members.length > 3 && `, +${members.length - 3} others`}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                                    <Users className="w-5 h-5" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Group Members ({members.length})</DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="h-[300px] mt-4 pr-4">
                                    <div className="space-y-4">
                                        {members.map((member) => (
                                            <div key={member.userId} className="flex items-center gap-3">
                                                <Avatar className="w-10 h-10">
                                                    <AvatarImage src={member.user?.image || undefined} />
                                                    <AvatarFallback>
                                                        {getInitials(member.user?.name || null)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                                                        {member.user?.name || 'Unknown'}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        {member.role !== 'member' && (
                                                            <Badge variant="outline" className="text-xs">
                                                                {member.role}
                                                            </Badge>
                                                        )}
                                                        {member.isOnline && (
                                                            <span className="flex items-center gap-1 text-xs text-green-600">
                                                                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                                                Online
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Messages Area */}
                <ScrollArea className="flex-1 p-2 md:p-4 z-10">
                    <div className="space-y-1 max-w-5xl mx-auto pb-4">
                        {isLoading && messages.length === 0 ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center py-12 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm mx-auto max-w-md mt-10 shadow-sm">
                                <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-300 font-medium">
                                    No messages yet
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Send a message to start the conversation!
                                </p>
                            </div>
                        ) : (
                            messages.map((message, index) => {
                                const isMe = message.userId === session?.user?.id;
                                const isSameUser = index > 0 && messages[index - 1].userId === message.userId;
                                const showDateSeparator = index === 0 || !isSameDay(new Date(message.createdAt), new Date(messages[index - 1].createdAt));

                                return (
                                    <div key={message.id}>
                                        {showDateSeparator && (
                                            <div className="flex justify-center my-4">
                                                <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-full shadow-sm">
                                                    {format(new Date(message.createdAt), 'MMMM d, yyyy')}
                                                </span>
                                            </div>
                                        )}

                                        <div
                                            className={cn(
                                                "flex w-full mb-1",
                                                isMe ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div className={cn(
                                                "flex max-w-[85%] md:max-w-[65%]",
                                                isMe ? "flex-row-reverse" : "flex-row"
                                            )}>
                                                {/* Avatar only for others and if it's the first message of a sequence */}
                                                {!isMe && (
                                                    <div className="w-8 mr-2 flex-shrink-0 flex flex-col justify-end">
                                                        {!isSameUser ? (
                                                            <Avatar className="w-8 h-8">
                                                                <AvatarImage src={message.user?.image || undefined} />
                                                                <AvatarFallback className="text-[10px]">
                                                                    {getInitials(message.user?.name || null)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        ) : <div className="w-8" />}
                                                    </div>
                                                )}

                                                <div className={cn(
                                                    "relative px-3 py-1.5 shadow-sm text-sm",
                                                    isMe
                                                        ? "bg-[#d9fdd3] dark:bg-[#005c4b] text-gray-900 dark:text-gray-100 rounded-2xl rounded-tr-none"
                                                        : "bg-white dark:bg-[#202c33] text-gray-900 dark:text-gray-100 rounded-2xl rounded-tl-none",
                                                    !isMe && !isSameUser && "mt-1"
                                                )}>
                                                    {/* Sender Name - Always show for others if not same user sequence */}
                                                    {!isMe && !isSameUser && (
                                                        <p className={cn("text-xs font-bold mb-1", getUserColor(message.user?.name || 'Unknown'))}>
                                                            {message.user?.name || 'Unknown'}
                                                        </p>
                                                    )}

                                                    <p className="whitespace-pre-wrap break-words leading-relaxed">
                                                        {message.content}
                                                    </p>

                                                    <div className={cn(
                                                        "text-[10px] mt-1 flex items-center gap-1 opacity-60 select-none",
                                                        isMe ? "justify-end" : "justify-end"
                                                    )}>
                                                        {format(new Date(message.createdAt), 'HH:mm')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="bg-gray-50 dark:bg-gray-800 p-2 md:p-3 z-10">
                    <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto flex items-end gap-2">
                        <div className="flex-1 bg-white dark:bg-gray-700 rounded-2xl flex items-center border border-gray-200 dark:border-gray-600 px-4 shadow-sm">
                            <Input
                                placeholder="Type a message..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                className="border-0 focus-visible:ring-0 p-0 bg-transparent max-h-32 text-base"
                                maxLength={5000}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={!messageInput.trim()}
                            className={cn(
                                "rounded-full w-10 h-10 p-0 flex-shrink-0 transition-all",
                                messageInput.trim()
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                            )}
                        >
                            <Send className="w-5 h-5 ml-0.5" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
