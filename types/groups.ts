// Group-related types

export interface ExamGroup {
    id: string;
    name: string;
    description: string | null;
    examType: string;
    examYear: number | null;
    subject: string | null;
    isPublic: boolean;
    maxMembers: number | null;
    memberCount: number | null;
    createdBy: string | null;
    createdAt: Date;
    updatedAt: Date;
    lastActivityAt: Date | null;
    tags: string[] | null;
    avatarUrl: string | null;
    isMember?: boolean;
}

export interface GroupMember {
    groupId: string;
    userId: string;
    role: "admin" | "moderator" | "member";
    joinedAt: Date;
    lastReadAt: Date | null;
    isOnline: boolean | null;
    lastSeenAt: Date | null;
    // Populated fields
    user?: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    };
}

export interface GroupMessage {
    id: string;
    groupId: string;
    userId: string;
    content: string;
    messageType: "text" | "image" | "file";
    fileUrl: string | null;
    fileName: string | null;
    replyToId: string | null;
    reactions: { emoji: string; userIds: string[] }[] | null;
    isEdited: boolean | null;
    isDeleted: boolean | null;
    createdAt: Date;
    updatedAt: Date | null;
    // Populated fields
    user?: {
        id: string;
        name: string | null;
        image: string | null;
    };
    replyTo?: GroupMessage;
}

export interface GroupWithDetails extends ExamGroup {
    members?: GroupMember[];
    isMember?: boolean;
    unreadCount?: number;
    lastMessage?: GroupMessage;
}

export interface CreateGroupInput {
    name: string;
    description?: string;
    examType: string;
    examYear?: number;
    subject?: string;
    isPublic?: boolean;
    maxMembers?: number;
    tags?: string[];
}

export interface SendMessageInput {
    groupId: string;
    content: string;
    messageType?: "text" | "image" | "file";
    fileUrl?: string;
    fileName?: string;
    replyToId?: string;
}

export interface GroupSearchFilters {
    examType?: string;
    subject?: string;
    examYear?: number;
    query?: string;
    tags?: string[];
}
