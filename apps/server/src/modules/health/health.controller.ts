import { Controller, Get, Res } from '@nestjs/common';
import { HealthService } from './health.service';
import type { FastifyReply } from 'fastify';
import { pool } from 'src/database/db';
import { HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async check(@Res() res: FastifyReply) {
    const health = await this.healthService.getHealth();
    const statusCode = health.status === 'up' ? 200 : 503;
    return res.status(statusCode).send(health);
  }
  @Get('ready')
  private async runCheck(check: () => Promise<unknown>): Promise<boolean> {
    try {
      await check();
      return true;
    } catch {
      return false;
    }
  }

  async readiness() {
    const checks = {
      database: await this.runCheck(() => pool.query('SELECT 1')),
      s3: await this.runCheck(async () => {
        const s3 = new S3Client();
        await s3.send(
          new HeadBucketCommand({
            Bucket: process.env.DO_BUCKET,
          }),
        );
      }),
    };

    return {
      status: Object.values(checks).every(Boolean) ? 'ok' : 'error',
      checks,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('metrics')
  async metrics() {
    const poolStats = {
      totalConnections: pool.totalCount,
      idleConnections: pool.idleCount,
      waitingClients: pool.waitingCount,
    };

    return {
      pool: poolStats,
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
