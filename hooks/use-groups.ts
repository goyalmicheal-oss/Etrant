import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ExamGroup } from "@/types/groups";

// API Functions
async function fetchGroups(params: {
    query?: string;
    examType?: string;
}): Promise<ExamGroup[]> {
    const urlParams = new URLSearchParams();
    if (params.query) urlParams.append("query", params.query);
    if (params.examType) urlParams.append("examType", params.examType);

    const response = await fetch(`/api/groups?${urlParams.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch groups");
    }
    const data = await response.json();
    return data.groups || [];
}

async function joinGroup(groupId: string): Promise<void> {
    const response = await fetch(`/api/groups/${groupId}/join`, {
        method: "POST",
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to join group");
    }
}

// Custom Hooks
export function useGroups(searchQuery: string, examTypeFilter: string) {
    return useQuery({
        queryKey: ["groups", searchQuery, examTypeFilter],
        queryFn: () => fetchGroups({ query: searchQuery, examType: examTypeFilter }),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    });
}

export function useJoinGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: joinGroup,
        onSuccess: (_, groupId) => {
            // Invalidate and refetch groups data after joining
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
        onError: (error: Error) => {
            alert(error.message);
        },
    });
}
