/**
 * Environment variable validation
 * This ensures all required environment variables are present at build/runtime
 */

const requiredEnvVars = [
    'DATABASE_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXT_BASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
] as const;

const optionalEnvVars = [
    'CRON_SECRET',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'RAZORPAY_WEBHOOK_SECRET',
    'POSTHOG_KEY',
    'POSTHOG_HOST',
] as const;

export function validateEnv() {
    const missing: string[] = [];
    const warnings: string[] = [];

    // Check required variables
    for (const varName of requiredEnvVars) {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    }

    // Check optional but recommended variables
    for (const varName of optionalEnvVars) {
        if (!process.env[varName]) {
            warnings.push(varName);
        }
    }

    if (missing.length > 0) {
        throw new Error(
            `❌ Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\n` +
            `Please add these to your .env.local file.`
        );
    }

    if (warnings.length > 0 && process.env.NODE_ENV !== 'production') {
        console.warn(
            `⚠️  Optional environment variables not set:\n${warnings.map(v => `  - ${v}`).join('\n')}\n` +
            `Some features may not work correctly.`
        );
    }

    // Validate URL formats
    try {
        new URL(process.env.DATABASE_URL!);
    } catch {
        throw new Error('DATABASE_URL must be a valid URL');
    }

    if (process.env.NEXT_BASE_URL) {
        try {
            new URL(process.env.NEXT_BASE_URL);
        } catch {
            throw new Error('NEXT_BASE_URL must be a valid URL');
        }
    }

    console.log('✅ Environment variables validated successfully');
}

// Run validation on import (during build/startup)
if (process.env.NODE_ENV !== 'test') {
    validateEnv();
}
