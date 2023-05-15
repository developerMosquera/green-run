import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { STATUS_BETS } from '../../users/enums';

export class PutDto {
  @IsEnum(STATUS_BETS)
  @ApiProperty()
  public status: string;
}
