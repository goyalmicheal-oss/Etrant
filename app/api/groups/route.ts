import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { examGroups, groupMembers } from "@/lib/db/schema";
import { auth } from "@/auth";
import { rateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import { createErrorResponse, sanitizeString } from "@/lib/validation";
import { eq, and, or, ilike, sql, desc } from "drizzle-orm";
import type { CreateGroupInput } from "@/types/groups";

const apiRateLimit = rateLimit(rateLimitConfigs.api);

// GET - List/Search groups
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return createErrorResponse("Unauthorized", 401);
        }

        // Rate limiting
        const rateLimitResponse = apiRateLimit(session.user.id);
        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        const { searchParams } = new URL(request.url);
        const examType = searchParams.get("examType");
        const subject = searchParams.get("subject");
        const query = searchParams.get("query");
        const myGroups = searchParams.get("myGroups") === "true";
        const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
        const offset = parseInt(searchParams.get("offset") || "0");

        let conditions: any[] = [eq(examGroups.isPublic, true)];

        if (examType) {
            conditions.push(eq(examGroups.examType, examType));
        }

        if (subject) {
            conditions.push(eq(examGroups.subject, subject));
        }

        if (query) {
            const searchQuery = `%${query}%`;
            conditions.push(
                or(
                    ilike(examGroups.name, searchQuery),
                    ilike(examGroups.description, searchQuery)
                )
            );
        }

        let groups;

        if (myGroups) {
            // Get user's groups
            groups = await db
                .select({
                    id: examGroups.id,
                    name: examGroups.name,
                    description: examGroups.description,
                    examType: examGroups.examType,
                    examYear: examGroups.examYear,
                    subject: examGroups.subject,
                    memberCount: examGroups.memberCount,
                    maxMembers: examGroups.maxMembers,
                    lastActivityAt: examGroups.lastActivityAt,
                    avatarUrl: examGroups.avatarUrl,
                    tags: examGroups.tags,
                    isMember: sql<boolean>`true`,
                })
                .from(examGroups)
                .innerJoin(groupMembers, eq(groupMembers.groupId, examGroups.id))
                .where(eq(groupMembers.userId, session.user.id))
                .orderBy(desc(examGroups.lastActivityAt))
                .limit(limit)
                .offset(offset);
        } else {
            // Search public groups and check membership
            const groupsData = await db
                .select({
                    id: examGroups.id,
                    name: examGroups.name,
                    description: examGroups.description,
                    examType: examGroups.examType,
                    examYear: examGroups.examYear,
                    subject: examGroups.subject,
                    memberCount: examGroups.memberCount,
                    maxMembers: examGroups.maxMembers,
                    lastActivityAt: examGroups.lastActivityAt,
                    avatarUrl: examGroups.avatarUrl,
                    tags: examGroups.tags,
                    // Check if user is member
                    isMember: sql<boolean>`EXISTS (
            SELECT 1 FROM ${groupMembers} 
            WHERE ${groupMembers.groupId} = ${examGroups.id} 
            AND ${groupMembers.userId} = ${session.user.id}
          )`,
                })
                .from(examGroups)
                .where(and(...conditions))
                .orderBy(desc(examGroups.memberCount), desc(examGroups.lastActivityAt))
                .limit(limit)
                .offset(offset);

            groups = groupsData;
        }

        return NextResponse.json({ groups, count: groups.length });
    } catch (error) {
        console.error("Error fetching groups:", error);
        return createErrorResponse("Failed to fetch groups", 500);
    }
}

// POST - Create a new group
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return createErrorResponse("Unauthorized", 401);
        }

        // Rate limiting
        const rateLimitResponse = apiRateLimit(session.user.id);
        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        const body: CreateGroupInput = await request.json();

        // Validate required fields
        if (!body.name || !body.examType) {
            return createErrorResponse("Name and exam type are required");
        }

        // Sanitize inputs
        const sanitizedName = sanitizeString(body.name).substring(0, 255);
        const sanitizedDescription = body.description
            ? sanitizeString(body.description)
            : null;

        // Create group
        const [newGroup] = await db
            .insert(examGroups)
            .values({
                name: sanitizedName,
                description: sanitizedDescription,
                examType: body.examType,
                examYear: body.examYear,
                subject: body.subject,
                isPublic: body.isPublic ?? true,
                maxMembers: body.maxMembers ?? 100,
                memberCount: 1,
                createdBy: session.user.id,
                tags: body.tags || [],
            })
            .returning();

        // Add creator as admin member
        await db.insert(groupMembers).values({
            groupId: newGroup.id,
            userId: session.user.id,
            role: "admin",
        });

        return NextResponse.json(
            { group: newGroup, message: "Group created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating group:", error);
        return createErrorResponse("Failed to create group", 500);
    }
}
