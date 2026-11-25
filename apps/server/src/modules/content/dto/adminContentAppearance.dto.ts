import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';
import { ContentAppearanceDto } from './contentAppearance.dto';

export class AdminContentAppearanceDto extends ContentAppearanceDto {
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(1)
  @ArrayUnique()
  @IsString({ each: true })
  categoryIds?: string[];
}
