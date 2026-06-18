import { IsOptional, IsString, IsIn } from 'class-validator';

export class SettlementHistoryQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'completed', 'rejected'])
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
