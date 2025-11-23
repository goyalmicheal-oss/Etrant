/**
 * Performance monitoring utilities
 */

export interface PerformanceMetric {
    name: string;
    value: number;
    unit: 'ms' | 'bytes' | 'count';
    timestamp: number;
}

class PerformanceMonitor {
    private metrics: PerformanceMetric[] = [];
    private readonly maxMetrics = 100;

    /**
     * Start timing an operation
     */
    startTimer(name: string): () => void {
        const startTime = performance.now();

        return () => {
            const duration = performance.now() - startTime;
            this.recordMetric({
                name,
                value: duration,
                unit: 'ms',
                timestamp: Date.now(),
            });
        };
    }

    /**
     * Record a metric
     */
    recordMetric(metric: PerformanceMetric): void {
        this.metrics.push(metric);

        // Keep only the most recent metrics
        if (this.metrics.length > this.maxMetrics) {
            this.metrics.shift();
        }

        // Log slow operations in development
        if (process.env.NODE_ENV === 'development' && metric.unit === 'ms' && metric.value > 1000) {
            console.warn(`⚠️ Slow operation detected: ${metric.name} took ${metric.value.toFixed(2)}ms`);
        }
    }

    /**
     * Get metrics for a specific operation
     */
    getMetrics(name?: string): PerformanceMetric[] {
        if (name) {
            return this.metrics.filter(m => m.name === name);
        }
        return [...this.metrics];
    }

    /**
     * Get average duration for an operation
     */
    getAverageDuration(name: string): number {
        const metrics = this.getMetrics(name).filter(m => m.unit === 'ms');
        if (metrics.length === 0) return 0;

        const sum = metrics.reduce((acc, m) => acc + m.value, 0);
        return sum / metrics.length;
    }

    /**
     * Clear all metrics
     */
    clear(): void {
        this.metrics = [];
    }

    /**
     * Get performance summary
     */
    getSummary(): Record<string, { avg: number; min: number; max: number; count: number }> {
        const summary: Record<string, { avg: number; min: number; max: number; count: number }> = {};

        const metricsByName = this.metrics.reduce((acc, metric) => {
            if (!acc[metric.name]) {
                acc[metric.name] = [];
            }
            acc[metric.name].push(metric.value);
            return acc;
        }, {} as Record<string, number[]>);

        Object.entries(metricsByName).forEach(([name, values]) => {
            summary[name] = {
                avg: values.reduce((a, b) => a + b, 0) / values.length,
                min: Math.min(...values),
                max: Math.max(...values),
                count: values.length,
            };
        });

        return summary;
    }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Decorator for measuring function execution time
 */
export function measurePerformance(name?: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;
        const metricName = name || `${target.constructor.name}.${propertyKey}`;

        descriptor.value = async function (...args: any[]) {
            const endTimer = performanceMonitor.startTimer(metricName);
            try {
                const result = await originalMethod.apply(this, args);
                return result;
            } finally {
                endTimer();
            }
        };

        return descriptor;
    };
}

/**
 * Measure async function performance
 */
export async function measureAsync<T>(
    name: string,
    fn: () => Promise<T>
): Promise<T> {
    const endTimer = performanceMonitor.startTimer(name);
    try {
        return await fn();
    } finally {
        endTimer();
    }
}

/**
 * Measure sync function performance
 */
export function measure<T>(name: string, fn: () => T): T {
    const endTimer = performanceMonitor.startTimer(name);
    try {
        return fn();
    } finally {
        endTimer();
    }
}

/**
 * Log performance summary to console
 */
export function logPerformanceSummary(): void {
    const summary = performanceMonitor.getSummary();

    if (Object.keys(summary).length === 0) {
        console.log('📊 No performance metrics recorded');
        return;
    }

    console.log('📊 Performance Summary:');
    console.table(
        Object.entries(summary).map(([name, stats]) => ({
            Operation: name,
            'Avg (ms)': stats.avg.toFixed(2),
            'Min (ms)': stats.min.toFixed(2),
            'Max (ms)': stats.max.toFixed(2),
            Count: stats.count,
        }))
    );
}
