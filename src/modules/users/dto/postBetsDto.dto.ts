import { ApiProperty } from '@nestjs/swagger';

export class PostBetsDto {
  @ApiProperty({ default: '[{ "amount": 25000, "user_id": 1, "bet_id": 2 }]' })
  readonly userBets: BetsDto[];
}

export class BetsDto {
  readonly amount: number;
  readonly user_id: number;
  readonly bet_id: number;
}
