import { IsEnum, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TRANSACTION_CATEGORIES } from '../enums';

export class PostTransactionsDto {
  @IsNumber()
  @ApiProperty()
  @Min(1)
  amount: number;

  @IsEnum(TRANSACTION_CATEGORIES)
  @ApiProperty({ description: 'Use DEPOSIT, WITHDRAW, BET or WINNING' })
  category: string;
}
