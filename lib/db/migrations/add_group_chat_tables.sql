-- Migration: Add Group Chat Tables
-- Created: 2025-11-23

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_groups_exam_type ON exam_groups(exam_type);
CREATE INDEX IF NOT EXISTS idx_groups_public ON exam_groups(is_public);
CREATE INDEX IF NOT EXISTS idx_groups_created_at ON exam_groups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_messages_group_created ON group_messages(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_user ON group_messages(user_id);

-- Add comments for documentation
COMMENT ON TABLE exam_groups IS 'Stores exam-specific study groups';
COMMENT ON TABLE group_members IS 'Tracks group membership and roles';
COMMENT ON TABLE group_messages IS 'Stores group chat messages';

COMMENT ON COLUMN exam_groups.exam_type IS 'Type of exam: JEE, NEET, UPSC, etc.';
COMMENT ON COLUMN exam_groups.is_public IS 'Whether group is publicly discoverable';
COMMENT ON COLUMN exam_groups.member_count IS 'Cached count of members for performance';
COMMENT ON COLUMN group_members.role IS 'Member role: admin, moderator, or member';
COMMENT ON COLUMN group_messages.message_type IS 'Type: text, image, or file';
COMMENT ON COLUMN group_messages.reactions IS 'JSON array of emoji reactions';
