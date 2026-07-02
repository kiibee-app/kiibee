import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class HealthService {
  private version = 'unknown';

  constructor() {
    try {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'),
      );
      this.version = packageJson.version || '0.0.1';
    } catch {
      this.version = '0.0.1';
    }
  }

  async getHealth() {
    const dbStart = Date.now();
    let dbStatus: 'up' | 'down' = 'up';
    let dbLatencyMs: number | undefined;
    let dbError: string | undefined;

    try {
      await db.execute(sql`SELECT 1`);
      dbLatencyMs = Date.now() - dbStart;
    } catch (error) {
      dbStatus = 'down';
      dbError = error instanceof Error ? error.message : String(error);
    }

    const memoryUsage = process.memoryUsage();
    const isHealthy = dbStatus === 'up';

    return {
      status: isHealthy ? ('up' as const) : ('down' as const),
      timestamp: new Date().toISOString(),
      version: this.version,
      environment: process.env.NODE_ENV || 'development',
      system: {
        uptime: Math.round(process.uptime() * 100) / 100,
        nodeVersion: process.version,
        memory: {
          heapUsedMb:
            Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
          heapTotalMb:
            Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100,
          rssMb: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100,
        },
      },
      services: {
        database: {
          status: dbStatus,
          ...(dbLatencyMs !== undefined && { latencyMs: dbLatencyMs }),
          ...(dbError !== undefined && { error: dbError }),
        },
      },
    };
  }
}
