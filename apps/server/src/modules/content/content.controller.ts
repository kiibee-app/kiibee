import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateContentDto } from './content.dto';
import { CreatorGuard } from '../auth/guards/admin.guard';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('categories')
  async getContentCategories() {
    return await this.contentService.getContentCategories();
  }

  @Get('types')
  async getContentTypes() {
    return await this.contentService.getContentTypes();
  }

  @UseGuards(JwtAuthGuard)
  @Post('assign')
  async assignUserCategories(
    @Req() req: any,
    @Body() body: { categoryIds: string[]; typeIds: string[] },
  ) {
    const userId = req.user.userId;

    return this.contentService.assignUserCategories({
      userId,
      categoryIds: body.categoryIds,
      typeIds: body.typeIds,
    });
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Post('create')
  async createContent(@Req() req: any, @Body() body: CreateContentDto) {
    const creatorId = req.user.userId;

    return this.contentService.createContentService(body, creatorId);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Get('collection/:id')
  async getContentByCollectionId(@Req() req: any) {
    const collectionId = req.params.id;
    return this.contentService.getContentByCollectionIdService(collectionId);
  }
}
