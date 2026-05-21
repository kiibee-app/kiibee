import { IsArray, ArrayNotEmpty } from 'class-validator';

export class AssignUserCategoriesDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'categoryIds must not be empty' })
  categoryIds!: string[];

  @IsArray()
  @ArrayNotEmpty({ message: 'typeIds must not be empty' })
  typeIds!: string[];
}
