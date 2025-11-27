"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import type { ExamGroup } from "@/types/groups";
import { useParams } from "next/navigation";

async function fetchMyGroups(searchQuery?: string): Promise<ExamGroup[]> {
    const params = new URLSearchParams();
    params.append("myGroups", "true");
    if (searchQuery) params.append("query", searchQuery);

    const response = await fetch(`/api/groups?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch groups");
    }
    const data = await response.json();
    return data.groups || [];
}

export function GroupsSidebar() {
    const params = useParams();
    const currentGroupId = params.groupId as string;
    const [searchQuery, setSearchQuery] = useState("");

    // Use TanStack Query for caching the groups list
    const { data: groups = [], isLoading } = useQuery({
        queryKey: ["myGroups", searchQuery],
        queryFn: () => fetchMyGroups(searchQuery),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    });

    const getInitials = (name: string | null) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="w-80 md:w-96 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col hidden md:flex">
            {/* Sidebar Header */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        Chats
                    </h2>
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Groups List */}
            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        </div>
                    ) : groups.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No groups found
                        </div>
                    ) : (
                        groups.map((g) => (
                            <Link
                                key={g.id}
                                href={`/groups/${g.id}`}
                                className={cn(
                                    "flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-50 dark:border-gray-800/50 cursor-pointer",
                                    g.id === currentGroupId && "bg-gray-100 dark:bg-gray-800"
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
                                            {g.lastActivityAt &&
                                                formatDistanceToNow(new Date(g.lastActivityAt), {
                                                    addSuffix: false,
                                                })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {g.description || "No description"}
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
