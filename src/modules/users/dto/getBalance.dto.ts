import { IsOptional, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetBalanceDto {
  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional()
  user_id: number;
}
