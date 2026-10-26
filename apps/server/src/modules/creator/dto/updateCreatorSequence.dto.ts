import { IsInt, IsOptional, Max, Min, ValidateIf } from 'class-validator';

export class UpdateCreatorSequenceDto {
  @IsOptional()
  @ValidateIf(
    (_obj, value) => value !== null && value !== undefined && value !== '',
  )
  @IsInt({ message: 'Sequence must be an integer' })
  @Min(1, { message: 'Sequence must be at least 1' })
  @Max(1000, { message: 'Sequence must be at most 1000' })
  sequence?: number | null;
}
