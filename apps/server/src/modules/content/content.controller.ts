import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
}
