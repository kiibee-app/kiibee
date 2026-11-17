import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { requirePubliclyVisibleCreator } from 'src/utils/publicCreatorVisibility';
import { getProfilePaymentState } from 'src/utils/profilePayment';
import { success } from 'src/utils/sendResponse';
import { makeContentPaidService } from './services/makeContentPaid.service';
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
  Param,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateContentDto,
  ReorderCollectionContentsDto,
  UpdateContentDto,
} from './content.dto';
import { AssignUserCategoriesDto } from './dto/assignUserCategories.dto';
import { CreatorGuard, AdminGuard } from '../auth/guards/admin.guard';
import { ContentAppearanceDto } from './dto/contentAppearance.dto';
import { ContentSettingDto } from './dto/contentSetting.dto';
import { RejectContentDto } from './dto/rejectContent.dto';
import * as getAllContentsService from './services/getAllContents.service';
import { CheckPlanLimit } from 'src/middleware/checkPlanLimit';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('profile-payment/:creatorId')
  async profilePayment(@Param('creatorId') creatorId: string) {
    const creator = await requirePubliclyVisibleCreator(creatorId);
    return success(
      await getProfilePaymentState(creator.id),
      'Profile payment settings',
      200,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile-entitlement/:creatorId')
  async profileEntitlement(
    @Param('creatorId') creatorId: string,
    @Req() req: any,
  ) {
    const creator = await requirePubliclyVisibleCreator(creatorId);
    return success(
      await getProfilePaymentState(creator.id, req.user.userId),
      'Profile entitlement',
      200,
    );
  }

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

  @UseGuards(JwtAuthGuard, CreatorGuard, CheckPlanLimit)
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
  @Put('collection/:id/order')
  async reorderCollectionContents(
    @Req() req: any,
    @Param('id') collectionId: string,
    @Body() body: ReorderCollectionContentsDto,
  ) {
    return this.contentService.reorderCollectionContents(
      collectionId,
      body.contentIds,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Put('update/:contentId')
  async updateContent(@Req() req: any, @Body() body: UpdateContentDto) {
    const contentId = req.params.contentId;
    const creatorId = req.user.userId;
    return this.contentService.updateContentService(contentId, body, creatorId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/creator-contents/:creatorId')
  async getAdminCreatorContents(@Param('creatorId') creatorId: string) {
    return this.contentService.getAdminCreatorContents(creatorId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/content-engagement/:contentId')
  async getAdminContentEngagement(@Param('contentId') contentId: string) {
    return this.contentService.getAdminContentEngagement(contentId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin/reject/:contentId')
  async rejectContent(
    @Param('contentId') contentId: string,
    @Body() body: RejectContentDto,
  ) {
    return this.contentService.rejectContentService(contentId, body);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin/make-paid/:contentId')
  async makeContentPaid(
    @Param('contentId') contentId: string,
    @Body()
    body: {
      buyPrice?: number;
      rentPrice?: number;
      rentDurationHours?: number;
    },
  ) {
    return makeContentPaidService(contentId, body);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin/make-free/:contentId')
  async makeContentFree(@Param('contentId') contentId: string) {
    return this.contentService.makeContentFreeService(contentId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/appearance/:creatorId')
  async getAdminCreatorAppearance(@Param('creatorId') creatorId: string) {
    return this.contentService.getContentAppearanceService(creatorId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('admin/appearance/:creatorId')
  async updateAdminCreatorAppearance(
    @Param('creatorId') creatorId: string,
    @Body() dto: ContentAppearanceDto,
  ) {
    return this.contentService.ContentAppearanceService(creatorId, dto);
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

  @UseGuards(OptionalJwtAuthGuard)
  @Post('all')
  async getAllContents(
    @Req() req: any,
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
      excludeChannelLockedCreatorContent:
        body?.excludeChannelLockedCreatorContent,
    };

    return this.contentService.getAllContents(
      safeLimit,
      search ?? '',
      sort ?? 'all',
      filter,
      req.user?.userId,
    );
  }

  @Post(':id/verify-code')
  async verifyContentAccessCode(
    @Param('id') contentId: string,
    @Body() body: { code?: string },
  ) {
    const code = body.code?.trim();
    if (!code)
      return this.contentService.verifyContentAccessCode(contentId, '');
    return this.contentService.verifyContentAccessCode(contentId, code);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':contentId/related-collection')
  async getRelatedCollectionContent(@Req() req: any) {
    const contentId = req.params.contentId;
    return this.contentService.getRelatedCollectionContent(
      contentId,
      req.user?.userId,
    );
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('public/collection/:id')
  async getPublicCollection(
    @Req() req: any,
    @Query('viewerId') viewerId?: string,
  ) {
    const collectionId = req.params.id;
    return this.contentService.getPublicCollectionService(
      collectionId,
      req.user?.userId,
    );
  }

  @Get(':id/:userId')
  async getSingleContent(
    @Req() req: any,
    @Query('creatorSlug') creatorSlug?: string,
    @Query('collectionSlug') collectionSlug?: string,
  ) {
    const contentId = req.params.id;
    const userId = req.params.userId;
    return this.contentService.getSingleContent(
      contentId,
      userId,
      creatorSlug,
      collectionSlug,
    );
  }
}
