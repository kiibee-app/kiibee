import { IsBoolean } from 'class-validator';

export class UpdateCreatorVisibilityDto {
  @IsBoolean()
  isHidden!: boolean;
}
