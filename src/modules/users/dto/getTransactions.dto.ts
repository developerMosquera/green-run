import { IsOptional, IsNumberString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TRANSACTION_CATEGORIES } from '../enums';

export class GetTransactionsDto {
  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional()
  user_id: number;

  @IsEnum(TRANSACTION_CATEGORIES)
  @ApiProperty({ description: 'Use DEPOSIT, WITHDRAW, BET or WINNING' })
  @IsOptional()
  @ApiPropertyOptional()
  category: string;
}
