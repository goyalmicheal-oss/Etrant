import { drizzle } from "drizzle-orm/neon-http";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";

// Configure connection with pooling for better performance
const sql: NeonQueryFunction<boolean, boolean> = neon(process.env.DATABASE_URL!, {
    fetchOptions: {
        cache: 'no-store', // Disable caching for real-time data
    },
});

// Create drizzle instance with optimized configuration
export const db = drizzle({ client: sql });

// Connection pool configuration
export const dbConfig = {
    // Maximum number of connections in the pool
    maxConnections: 20,
    // Minimum number of connections to maintain
    minConnections: 2,
    // Connection timeout in milliseconds
    connectionTimeout: 30000,
    // Idle timeout in milliseconds
    idleTimeout: 30000,
};

