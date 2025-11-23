import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  date,
  jsonb,
  real,
  varchar,
} from "drizzle-orm/pg-core";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { AdapterAccountType } from "@auth/core/adapters";

const connectionString = process.env.DATABASE_URL as string;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}
const pool = neon(connectionString);
export const db = drizzle(pool);

// -------------------- USERS --------------------
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  streak: integer("streak").default(0),
  interest: text("interest"),
  points: integer("points").default(0),
  // rank: text("rank"),
  language: text("language"),
  lastActiveDate: text("lastActiveDate"),
  plan: text("plan").default("Free"),
  subscriptionActive: boolean("subscriptionActive").default(false),
  subscriptionEnd: text("subscriptionEnd"),
  joinDate: date("joinDate"),
});

// -------------------- PAYMENTS --------------------
export const payments = pgTable("payments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id"),
  // Razorpay payment ID (unique identifier for each payment)
  razorpayPaymentId: varchar("razorpay_payment_id", { length: 255 })
    .unique()
    .notNull(),
  method: varchar("method", { length: 50 }), // 'card', 'upi', 'netbanking', etc.
  webhookConfirmed: boolean("webhook_confirmed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const waitlist = pgTable("waitlist", {
  email: text("email").notNull(),
  createdAt: timestamp("created_at"),
});
// -------------------- FILE ANALYZE --------------------
export const files = pgTable("files", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});
// -------------------- FILE MCQ --------------------
export const mcqs = pgTable("file_mcqs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  fileId: text("file_id")
    .references(() => files.id, { onDelete: "cascade" })
    .notNull(),
  question: text("question").notNull(),
  difficulty: text("difficulty").notNull(), // "medium" or "hard"
  category: text("category").notNull(),
  tags: text("tags").array(),
  context: text("context"),
  estimatedTime: integer("estimated_time"),

  options: jsonb("options").notNull(), // store 4 option objects
  previousYearQuestion: varchar("previous_year_question", { length: 255 }),
  correctAnswer: integer("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  metadata: jsonb("metadata"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// -------------------- FEEDBACK --------------------
export const feedbacks = pgTable("feedbacks", {
  id: serial("id").primaryKey(),
  userName: text("user_name").notNull(),
  email: text("email").notNull(),
  feedback: text("feedback").notNull(),
});

// -------------------- USER STATS --------------------
export const userStats = pgTable(
  "user_stats",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    totalReels: integer("totalReels").default(0),
    totalQuizzes: integer("totalQuizzes").default(0),
    averageScore: integer("averageScore").default(0), // %
    studyTime: real("studyTime").default(0), // hours
    globalRank: integer("globalRank"),
  },
  (t) => [primaryKey({ columns: [t.userId] })],
);
// -------------------- DAILY DIGEST  --------------------
export const dailyDigest = pgTable("daily_digest", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  isRelevant: boolean("is_relevant").notNull().default(false),
  summary: text("summary").notNull(),
  relevantQuestions:
    jsonb("relevant_questions").$type<{ question: string; answer: string }[]>(),
  sourceUrl: text("source_url"),
  topic: text("topic"), // store comma-separated tags OR normalize into another table
  date: text("date").notNull(),
});

// -------------------- DAILY POINTS --------------------
export const dailyPoints = pgTable("daily_points", {
  id: serial("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  day: text("day"), // e.g. Mon
  date: date("date"),
  points: integer("pois"),
});

// -------------------- WEEKLY ACTIVITY --------------------
export const weeklyActivity = pgTable("weekly_activity", {
  id: serial("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  week: text("week"), // e.g. Week 1
  reels: integer("reels").default(0),
  quizzes: integer("quizzes").default(0),
  hours: real("hours").default(0),
});

// -------------------- SUBJECT PROGRESS --------------------
export const subjectProgress = pgTable("subject_progress", {
  id: serial("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  subject: text("subject"),
  progress: integer("progress").default(0), // %
  color: text("color"), // Tailwind class or HEX
});

// -------------------- BADGES --------------------
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  icon: text("icon"), // path to icon image
  rarity: text("rarity"), // common, rare, epic
});

// -------------------- USER BADGES --------------------
export const userBadges = pgTable(
  "user_badges",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    badgeId: integer("badgeId")
      .notNull()
      .references(() => badges.id, { onDelete: "cascade" }),
    dateUnlocked: date("dateUnlocked"),
  },
  (t) => [primaryKey({ columns: [t.userId, t.badgeId] })],
);

// -------------------- EXAM GROUPS --------------------
export const examGroups = pgTable("exam_groups", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  examType: varchar("exam_type", { length: 100 }).notNull(), // e.g., "JEE", "NEET", "UPSC"
  examYear: integer("exam_year"), // e.g., 2025
  subject: varchar("subject", { length: 100 }), // e.g., "Physics", "Chemistry"
  isPublic: boolean("is_public").default(true).notNull(),
  maxMembers: integer("max_members").default(100),
  memberCount: integer("member_count").default(0),
  createdBy: text("created_by")
    .references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  tags: text("tags").array(), // searchable tags
  avatarUrl: text("avatar_url"),
});

// -------------------- GROUP MEMBERS --------------------
export const groupMembers = pgTable(
  "group_members",
  {
    groupId: text("group_id")
      .notNull()
      .references(() => examGroups.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 50 }).default("member").notNull(), // "admin", "moderator", "member"
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    lastReadAt: timestamp("last_read_at").defaultNow(),
    isOnline: boolean("is_online").default(false),
    lastSeenAt: timestamp("last_seen_at"),
  },
  (t) => [primaryKey({ columns: [t.groupId, t.userId] })],
);

// -------------------- GROUP MESSAGES --------------------
export const groupMessages = pgTable("group_messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  groupId: text("group_id")
    .notNull()
    .references(() => examGroups.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  messageType: varchar("message_type", { length: 50 }).default("text").notNull(), // "text", "image", "file"
  fileUrl: text("file_url"),
  fileName: varchar("file_name", { length: 255 }),
  replyToId: text("reply_to_id"), // for threaded conversations
  reactions: jsonb("reactions").$type<{ emoji: string; userIds: string[] }[]>(),
  isEdited: boolean("is_edited").default(false),
  isDeleted: boolean("is_deleted").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// -------------------- AUTH TABLES --------------------
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ],
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    primaryKey({ columns: [authenticator.userId, authenticator.credentialID] }),
  ],
);
