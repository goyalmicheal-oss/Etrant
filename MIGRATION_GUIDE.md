# Database Migration Guide

## Quick Migration (Recommended)

### Option 1: Using Drizzle Kit Push (Easiest)

This will automatically sync your schema with the database:

```bash
npm run db:push
```

Or directly:

```bash
npx drizzle-kit push
```

**What it does:**
- Reads your schema from `lib/db/schema.ts`
- Compares with current database
- Creates the new tables (exam_groups, group_members, group_messages)
- Adds indexes automatically

---

### Option 2: Using Custom Migration Script

If you prefer more control:

```bash
npm run db:migrate
```

This runs the SQL file in `lib/db/migrations/add_group_chat_tables.sql`

---

## Manual Migration (SQL)

If you prefer to run SQL manually, connect to your database and run:

```sql
-- Create exam_groups table
CREATE TABLE IF NOT EXISTS exam_groups (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  exam_type VARCHAR(100) NOT NULL,
  exam_year INTEGER,
  subject VARCHAR(100),
  is_public BOOLEAN DEFAULT TRUE NOT NULL,
  max_members INTEGER DEFAULT 100,
  member_count INTEGER DEFAULT 0,
  created_by TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  last_activity_at TIMESTAMP DEFAULT NOW(),
  tags TEXT[],
  avatar_url TEXT
);

-- Create group_members table
CREATE TABLE IF NOT EXISTS group_members (
  group_id TEXT NOT NULL REFERENCES exam_groups(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member' NOT NULL,
  joined_at TIMESTAMP DEFAULT NOW() NOT NULL,
  last_read_at TIMESTAMP DEFAULT NOW(),
  is_online BOOLEAN DEFAULT FALSE,
  last_seen_at TIMESTAMP,
  PRIMARY KEY (group_id, user_id)
);

-- Create group_messages table
CREATE TABLE IF NOT EXISTS group_messages (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES exam_groups(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text' NOT NULL,
  file_url TEXT,
  file_name VARCHAR(255),
  reply_to_id TEXT,
  reactions JSONB,
  is_edited BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_groups_exam_type ON exam_groups(exam_type);
CREATE INDEX IF NOT EXISTS idx_groups_public ON exam_groups(is_public);
CREATE INDEX IF NOT EXISTS idx_groups_created_at ON exam_groups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_messages_group_created ON group_messages(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_user ON group_messages(user_id);
```

---

## Verification

After migration, verify the tables were created:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('exam_groups', 'group_members', 'group_messages');

-- Check indexes
SELECT indexname 
FROM pg_indexes 
WHERE tablename IN ('exam_groups', 'group_members', 'group_messages');
```

---

## Rollback (If Needed)

To remove the group chat tables:

```sql
DROP TABLE IF EXISTS group_messages CASCADE;
DROP TABLE IF EXISTS group_members CASCADE;
DROP TABLE IF EXISTS exam_groups CASCADE;
```

---

## Troubleshooting

### Error: "relation already exists"
- Tables already created, migration successful!
- Or run: `DROP TABLE` commands above and retry

### Error: "permission denied"
- Check database user has CREATE TABLE permissions
- Verify DATABASE_URL in .env.local is correct

### Error: "database connection failed"
- Check DATABASE_URL is set correctly
- Verify database is running
- Check network/firewall settings

---

## What Gets Created

### Tables (3)
1. **exam_groups** - Group information
2. **group_members** - Membership tracking
3. **group_messages** - Chat messages

### Indexes (7)
- idx_groups_exam_type
- idx_groups_public
- idx_groups_created_at
- idx_group_members_user
- idx_group_members_group
- idx_messages_group_created
- idx_messages_user

### Relationships
- group_members.group_id → exam_groups.id
- group_members.user_id → user.id
- group_messages.group_id → exam_groups.id
- group_messages.user_id → user.id
- exam_groups.created_by → user.id

---

## Next Steps After Migration

1. ✅ Verify tables created
2. ✅ Install Pusher: `pnpm add pusher pusher-js date-fns`
3. ✅ Add Pusher credentials to `.env.local`
4. ✅ Restart dev server: `npm run dev`
5. ✅ Test group creation at `/groups/create`
6. ✅ Test chat functionality

---

## Recommended: Use Drizzle Kit Push

The easiest and safest method:

```bash
npx drizzle-kit push
```

This will:
- ✅ Detect schema changes automatically
- ✅ Show you a preview before applying
- ✅ Create tables safely with IF NOT EXISTS
- ✅ Add all indexes
- ✅ Handle foreign keys correctly
