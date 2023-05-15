import { IsString, IsNumberString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetDto {
  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional()
  public event_id: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  public sport: string;
}
