import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { CollectionService } from './collection.service';
import {
  CreateCollectionDto,
  UpdateCollectionDto,
} from './dto/createCollection.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatorGuard } from '../auth/guards/admin.guard';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    role: string;
  };
};

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Post()
  @Post('create')
  async createCollection(
    @Body() dto: CreateCollectionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.collectionService.createCollectionService(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Get()
  async getAllCollections(@Req() req: AuthenticatedRequest) {
    return this.collectionService.getAllCollectionsService(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Get(':id')
  async getCollectionById(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.collectionService.getCollectionByIdService(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Patch(':id')
  async updateCollection(
    @Param('id') id: string,
    @Body() dto: Partial<UpdateCollectionDto>,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.collectionService.updateCollectionService(
      id,
      dto,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Delete(':id')
  async deleteCollection(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.collectionService.deleteCollectionService(id, req.user.userId);
  }
}
