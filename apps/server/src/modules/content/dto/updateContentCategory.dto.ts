import { IsNotEmpty, IsString } from 'class-validator';
export class UpdateContentCategoryDto {
  @IsString()
  @IsNotEmpty()
  categoryId!: string;
}
