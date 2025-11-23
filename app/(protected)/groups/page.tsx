'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Users, Calendar, BookOpen, Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { ExamGroup } from '@/types/groups';
import { Button } from '@/components/ui/button';

export default function GroupsPage() {
    const [groups, setGroups] = useState<ExamGroup[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [examTypeFilter, setExamTypeFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchGroups();
    }, [searchQuery, examTypeFilter]);

    const fetchGroups = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('query', searchQuery);
            if (examTypeFilter) params.append('examType', examTypeFilter);

            const response = await fetch(`/api/groups?${params.toString()}`);
            const data = await response.json();
            setGroups(data.groups || []);
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const joinGroup = async (groupId: string) => {
        try {
            const response = await fetch(`/api/groups/${groupId}/join`, {
                method: 'POST',
            });

            if (response.ok) {
                window.location.href = `/groups/${groupId}`;
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to join group');
            }
        } catch (error) {
            console.error('Error joining group:', error);
            alert('Failed to join group');
        }
    };

    const examTypes = ['JEE', 'NEET', 'UPSC', 'CAT', 'GATE', 'SSC', 'Banking'];

    const getTagColor = (index: number) => {
        const colors = [
            'bg-green-700',
            'bg-orange-700',
            'bg-indigo-700',
            'bg-yellow-700',
            'bg-blue-700',
        ];
        return colors[index % colors.length];
    };

    return (
        <div className="container mx-auto px-4 max-md:pt-24 py-8 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="md:text-3xl text-xl font-bold text-gray-900 dark:text-gray-100">
                        Exam Study Groups
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-md:text-sm mt-1">
                        Join groups and collaborate with fellow students
                    </p>
                </div>
                <Link href="/groups/create">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Plus className="w-4 h-4" />
                        Create Group
                    </Button>
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 md:w-5 md:h-5 w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Search groups..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 max-md:text-sm"
                    />
                </div>

                {/* Exam Type Filters */}
                <div className="flex flex-wrap gap-2">
                    <Button
                        size={"sm"}
                        onClick={() => setExamTypeFilter('')}
                        className={` transition-colors duration-200 ${examTypeFilter === ''
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                            }`}
                    >
                        All
                    </Button>
                    {examTypes.map((type) => (
                        <Button
                            size={"sm"}
                            key={type}
                            onClick={() => setExamTypeFilter(type)}
                            className={`transition-colors duration-200 ${examTypeFilter === type
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                                }`}
                        >
                            {type}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Groups Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            ) : groups.length === 0 ? (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        No groups found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Try adjusting your search or create a new group
                    </p>
                    <Link href="/groups/create">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            Create New Group
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group) => (
                        <div
                            key={group.id}
                            className="bg-gray-300 dark:bg-gray-900 p-4 rounded-xl border border-gray-400 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300"
                        >
                            <div className="border-b border-gray-400 dark:border-gray-700 pb-4">
                                <h2 className="text-lg font-semibold text-gray-950 dark:text-gray-100 line-clamp-1">
                                    {group.name}
                                </h2>
                                <p className="text-sm text-gray-700 dark:text-gray-400 mt-1 line-clamp-2">
                                    {group.description || 'No description'}
                                </p>
                            </div>

                            <div className="mt-4 space-y-3">
                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-indigo-700 px-3 py-1 text-xs rounded-full text-white flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" />
                                        {group.examType}
                                    </span>
                                    {group.examYear && (
                                        <span className="bg-blue-700 px-3 py-1 text-xs rounded-full text-white flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {group.examYear}
                                        </span>
                                    )}
                                    {group.subject && (
                                        <span className="bg-green-700 px-3 py-1 text-xs rounded-full text-white">
                                            {group.subject}
                                        </span>
                                    )}
                                </div>

                                {/* Member Count */}
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <Users className="w-4 h-4 mr-1" />
                                    {group.memberCount || 0} members
                                    {group.maxMembers && ` / ${group.maxMembers}`}
                                </div>

                                {/* Custom Tags */}
                                {group.tags && group.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {group.tags.slice(0, 3).map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className={`${getTagColor(idx)} px-2 py-1 text-[10px] rounded-full text-white`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Action Button */}
                                {group.isMember ? (
                                    <Link href={`/groups/${group.id}`} className="block w-full">
                                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 mt-2">
                                            Open Chat
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button
                                        onClick={() => joinGroup(group.id)}
                                        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-200 mt-2"
                                    >
                                        Join Group
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
