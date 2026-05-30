"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Send,
  Users,
  Loader2,
  Info,
  Smile,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGroupMessages } from "@/hooks/use-group-messages";
import { format, isSameDay, formatDistanceToNow } from "date-fns";
import type { ExamGroup, GroupMember } from "@/types/groups";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import CircleLoader from "@/components/loader/simple-loader-circle";

export default function GroupChatPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const groupId = params.groupId as string;

  const [group, setGroup] = useState<ExamGroup | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoadingGroup, setIsLoadingGroup] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, sendMessage } = useGroupMessages({
    groupId,
    enabled: !!groupId,
  });

  useEffect(() => {
    if (groupId) {
      fetchGroupDetails();
      fetchMembers();
    }
  }, [groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}`);
      if (!response.ok) {
        throw new Error("Group not found");
      }
      const data = await response.json();
      setGroup(data.group);
    } catch (error) {
      console.error("Error fetching group:", error);
      toast.error("Failed to load group");
      router.push("/groups");
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
      console.error("Error fetching members:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim()) return;

    try {
      await sendMessage(messageInput.trim());
      setMessageInput("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a consistent color for a username
  const getUserColor = (name: string) => {
    const colors = [
      "text-red-500",
      "text-orange-500",
      "text-amber-500",
      "text-green-500",
      "text-emerald-500",
      "text-teal-500",
      "text-cyan-500",
      "text-blue-500",
      "text-indigo-500",
      "text-violet-500",
      "text-purple-500",
      "text-fuchsia-500",
      "text-pink-500",
      "text-rose-500",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex h-full bg-gray-100 dark:bg-gray-800/50 justify-center items-center overflow-hidden">
        <Loader2 className="animate-spin w-full " />
      </div>
    )
  }


  if (!group) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Group not found</h2>
        <Link href="/groups">
          <Button>Back to Groups</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden">


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
                {members
                  .map((m) => m.user?.name)
                  .filter(Boolean)
                  .slice(0, 3)
                  .join(", ")}
                {members.length > 3 && `, +${members.length - 3} others`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
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
                      <div
                        key={member.userId}
                        className="flex items-center gap-3"
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.user?.image || undefined} />
                          <AvatarFallback>
                            {getInitials(member.user?.name || null)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                            {member.user?.name || "Unknown"}
                          </p>
                          <div className="flex items-center gap-2">
                            {member.role !== "member" && (
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
              <CircleLoader />
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
                const isSameUser =
                  index > 0 && messages[index - 1].userId === message.userId;
                const showDateSeparator =
                  index === 0 ||
                  !isSameDay(
                    new Date(message.createdAt),
                    new Date(messages[index - 1].createdAt),
                  );

                return (
                  <div key={message.id}>
                    {showDateSeparator && (
                      <div className="flex justify-center my-4">
                        <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-full shadow-sm">
                          {format(new Date(message.createdAt), "MMMM d, yyyy")}
                        </span>
                      </div>
                    )}

                    <div
                      className={cn(
                        "flex w-full mb-1",
                        isMe ? "justify-end" : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "flex max-w-[85%] md:max-w-[65%]",
                          isMe ? "flex-row-reverse" : "flex-row",
                        )}
                      >
                        {/* Avatar only for others and if it's the first message of a sequence */}
                        {!isMe && (
                          <div className="w-8 mr-2 flex-shrink-0 flex flex-col justify-end">
                            {!isSameUser ? (
                              <Avatar className="w-8 h-8">
                                <AvatarImage
                                  src={message.user?.image || undefined}
                                />
                                <AvatarFallback className="text-[10px]">
                                  {getInitials(message.user?.name || null)}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="w-8" />
                            )}
                          </div>
                        )}

                        <div
                          className={cn(
                            "relative px-3 py-1.5 shadow-sm text-sm",
                            isMe
                              ? "bg-[#d9fdd3] dark:bg-[#005c4b] text-gray-900 dark:text-gray-100 rounded-2xl rounded-tr-none"
                              : "bg-white dark:bg-[#202c33] text-gray-900 dark:text-gray-100 rounded-2xl rounded-tl-none",
                            !isMe && !isSameUser && "mt-1",
                          )}
                        >
                          {/* Sender Name - Always show for others if not same user sequence */}
                          {!isMe && !isSameUser && (
                            <p
                              className={cn(
                                "text-xs font-bold mb-1",
                                getUserColor(message.user?.name || "Unknown"),
                              )}
                            >
                              {message.user?.name || "Unknown"}
                            </p>
                          )}

                          <p className="whitespace-pre-wrap break-words leading-relaxed">
                            {message.content}
                          </p>

                          <div
                            className={cn(
                              "text-[10px] mt-1 flex items-center gap-1 opacity-60 select-none",
                              isMe ? "justify-end" : "justify-end",
                            )}
                          >
                            {format(new Date(message.createdAt), "HH:mm")}
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
          <form
            onSubmit={handleSendMessage}
            className="max-w-5xl mx-auto flex items-end gap-2"
          >
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
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500",
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
