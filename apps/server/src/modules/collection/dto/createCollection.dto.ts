import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class UpdateCollectionDto {
  @IsString()
  name?: string;

  @IsString()
  coverImageUrl?: string;

  visibility?: 'public' | 'hidden' | 'draft' | 'private';

  accessType?: 'free' | 'paid' | 'password' | 'email_gated';

  buyPrice?: number;

  rentPrice?: number;

  rentDuration?: string;

  description?: string;

  sortOrder?: number;

  isPublished?: boolean;
}
