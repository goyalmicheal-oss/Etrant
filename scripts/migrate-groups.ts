// Simple migration script to create group chat tables
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
    console.log('🚀 Starting migration...\n');

    try {
        // Create exam_groups table
        console.log('📊 Creating exam_groups table...');
        await sql`
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
      )
    `;

        // Create group_members table
        console.log('📊 Creating group_members table...');
        await sql`
      CREATE TABLE IF NOT EXISTS group_members (
        group_id TEXT NOT NULL REFERENCES exam_groups(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'member' NOT NULL,
        joined_at TIMESTAMP DEFAULT NOW() NOT NULL,
        last_read_at TIMESTAMP DEFAULT NOW(),
        is_online BOOLEAN DEFAULT FALSE,
        last_seen_at TIMESTAMP,
        PRIMARY KEY (group_id, user_id)
      )
    `;

        // Create group_messages table
        console.log('📊 Creating group_messages table...');
        await sql`
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
      )
    `;

        // Create indexes
        console.log('🔍 Creating indexes...');
        await sql`CREATE INDEX IF NOT EXISTS idx_groups_exam_type ON exam_groups(exam_type)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_groups_public ON exam_groups(is_public)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_messages_group_created ON group_messages(group_id, created_at DESC)`;

        console.log('\n✅ Migration completed successfully!\n');
        console.log('📋 Created:');
        console.log('   - exam_groups table');
        console.log('   - group_members table');
        console.log('   - group_messages table');
        console.log('   - 4 performance indexes\n');

    } catch (error: any) {
        if (error.message?.includes('already exists')) {
            console.log('\n✅ Tables already exist - migration not needed!\n');
        } else {
            console.error('\n❌ Migration failed:', error.message);
            throw error;
        }
    }
}

migrate()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
