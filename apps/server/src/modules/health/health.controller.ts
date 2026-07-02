import { Controller, Get, Res } from '@nestjs/common';
import { HealthService } from './health.service';
import type { FastifyReply } from 'fastify';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async check(@Res() res: FastifyReply) {
    const health = await this.healthService.getHealth();
    const statusCode = health.status === 'up' ? 200 : 503;
    return res.status(statusCode).send(health);
  }
}
