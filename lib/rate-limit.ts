import { NextResponse } from 'next/server';

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

const rateLimitStore: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    Object.keys(rateLimitStore).forEach(key => {
        if (rateLimitStore[key].resetTime < now) {
            delete rateLimitStore[key];
        }
    });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
    windowMs: number; // Time window in milliseconds
    maxRequests: number; // Maximum number of requests per window
}

export function rateLimit(config: RateLimitConfig) {
    const { windowMs, maxRequests } = config;

    return function rateLimitMiddleware(identifier: string): NextResponse | null {
        const now = Date.now();
        const key = identifier;

        if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
            rateLimitStore[key] = {
                count: 1,
                resetTime: now + windowMs,
            };
            return null; // Allow request
        }

        rateLimitStore[key].count++;

        if (rateLimitStore[key].count > maxRequests) {
            const retryAfter = Math.ceil((rateLimitStore[key].resetTime - now) / 1000);

            return NextResponse.json(
                {
                    error: 'Too many requests',
                    message: 'Rate limit exceeded. Please try again later.',
                    retryAfter
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': retryAfter.toString(),
                        'X-RateLimit-Limit': maxRequests.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': new Date(rateLimitStore[key].resetTime).toISOString(),
                    }
                }
            );
        }

        return null; // Allow request
    };
}

// Predefined rate limit configurations
export const rateLimitConfigs = {
    // Strict rate limit for authentication endpoints
    auth: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 5,
    },
    // Standard rate limit for API endpoints
    api: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 60,
    },
    // Relaxed rate limit for file uploads
    fileUpload: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 10,
    },
    // Very strict for webhooks
    webhook: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 100,
    },
};
