"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Users, Calendar, BookOpen, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExamGroup } from "@/types/groups";
import CircleLoader from "@/components/loader/simple-loader-circle";

export default function MyGroupsPage() {
  const [groups, setGroups] = useState<ExamGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyGroups();
  }, [searchQuery]);

  const fetchMyGroups = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("myGroups", "true");
      if (searchQuery) params.append("query", searchQuery);

      const response = await fetch(`/api/groups?${params.toString()}`);
      const data = await response.json();
      setGroups(data.groups || []);
    } catch (error) {
      console.error("Error fetching my groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            My Study Groups
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Groups you have joined and are participating in
          </p>
        </div>
        <Link href="/groups">
          <Button variant="outline">Browse All Groups</Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search your groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Groups Grid */}
      {isLoading ? (
        <CircleLoader />
      ) : groups.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No groups joined yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Browse available groups and join a community
          </p>
          <Link href="/groups">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Browse Groups
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card
              key={group.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-lg line-clamp-1">
                      {group.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {group.description || "No description"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <BookOpen className="w-3 h-3" />
                      {group.examType}
                    </Badge>
                    {group.examYear && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Calendar className="w-3 h-3" />
                        {group.examYear}
                      </Badge>
                    )}
                  </div>

                  {/* Member Count */}
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    {group.memberCount || 0} members
                  </div>

                  {/* Custom Tags */}
                  {group.tags && group.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {group.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Button */}
                  <Link href={`/groups/${group.id}`} className="block w-full">
                    <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white">
                      <MessageCircle className="w-4 h-4" />
                      Open Chat
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
