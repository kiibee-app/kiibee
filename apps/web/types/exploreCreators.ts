import type { CreatorLayoutKey } from "@/utils/creatorChannel";

export type ExploreCreator = {
  id: string;
  name: string;
  slug: string | null;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  mobileCoverImageUrl?: string | null;
  category: string | null;
  categoryName?: string | null;
  contentCategory?: Array<string | { name?: string | null }> | null;
  uploadCount: number;
  subscriberCount: number;
  createdAt: string;
  contentDescription?: string | null;
  exampleWorkLink?: string | null;
  supportEmail?: string | null;
  accountEmail?: string | null;
  accessType?: string | null;
  layout?: CreatorLayoutKey | null;
};

export type ExploreCreatorsResponse = {
  success?: boolean;
  message?: string;
  data?: ExploreCreator[];
};

export type CreatorContentCategoryItem = {
  creatorId?: string | null;
  categoryName?: string | null;
};

export type CreatorContentCategoriesResponse = {
  success?: boolean;
  message?: string;
  data?: CreatorContentCategoryItem[] | null;
};

export type CreatorPublicProfileResponse = {
  success?: boolean;
  message?: string;
  data?: ExploreCreator;
};
