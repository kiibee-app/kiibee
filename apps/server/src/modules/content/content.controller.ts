import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  Delete,
  Query,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateContentDto, UpdateContentDto } from './content.dto';
import { AssignUserCategoriesDto } from './dto/assignUserCategories.dto';
import { CreatorGuard } from '../auth/guards/admin.guard';
import { ContentAppearanceDto } from './dto/contentAppearance.dto';
import { ContentSettingDto } from './dto/contentSetting.dto';
import * as getAllContentsService from './services/getAllContents.service';

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
    @Body() dto: AssignUserCategoriesDto,
  ) {
    const userId = req.user.userId;

    return this.contentService.assignUserCategories({
      userId,
      categoryIds: dto.categoryIds,
      typeIds: dto.typeIds,
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

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Put('update/:contentId')
  async updateContent(@Req() req: any, @Body() body: UpdateContentDto) {
    const contentId = req.params.contentId;
    const creatorId = req.user.userId;
    return this.contentService.updateContentService(contentId, body, creatorId);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Get('/:id')
  async getContentById(@Req() req: any) {
    const contentId = req.params.id;
    return this.contentService.getContentByIdService(contentId);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Delete('delete/:contentId')
  async deleteContent(@Req() req: any) {
    const contentId = req.params.contentId;
    return this.contentService.deleteContentService(contentId);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Get('appearance')
  async getAppearance(@Req() req: any) {
    const userId = req.user.userId;
    return this.contentService.getContentAppearanceService(userId);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Put('appearance')
  async updateAppearance(@Req() req: any, @Body() dto: ContentAppearanceDto) {
    const userId = req.user.userId;
    return this.contentService.ContentAppearanceService(userId, dto);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Get('setting')
  async getContentSetting(@Req() req: any) {
    const userId = req.user.userId;
    return this.contentService.getContentSettingByUserId(userId);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Put('setting')
  async createOrUpdateContentSetting(
    @Req() req: any,
    @Body() dto: ContentSettingDto,
  ) {
    const userId = req.user.userId;
    return this.contentService.createOrUpdateContentSetting(userId, dto);
  }

  @Post('all')
  async getAllContents(
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: getAllContentsService.SortField,
    @Body() body?: getAllContentsService.GetAllContentsFilter,
  ) {
    const parsedLimit = Number.parseInt(limit ?? '24', 10);

    const safeLimit =
      Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 24;

    const filter: getAllContentsService.GetAllContentsFilter = {
      search: body?.search,
      contentTypeId: body?.contentTypeId,
      creatorId: body?.creatorId,
      categoryId: body?.categoryId,
      accessType: body?.accessType,
      minPrice: body?.minPrice,
      maxPrice: body?.maxPrice,
      rating: body?.rating,
    };

    return this.contentService.getAllContents(
      safeLimit,
      search ?? '',
      sort ?? 'all',
      filter,
    );
  }

  @Get(':contentId/related-collection')
  async getRelatedCollectionContent(@Req() req: any) {
    const contentId = req.params.contentId;
    return this.contentService.getRelatedCollectionContent(contentId);
  }

  @Get(':id/:userId')
  async getSingleContent(@Req() req: any) {
    const contentId = req.params.id;
    const userId = req.params.userId;
    return this.contentService.getSingleContent(contentId, userId);
  }
}
