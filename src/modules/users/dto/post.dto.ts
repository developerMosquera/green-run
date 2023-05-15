import {
  IsString,
  IsEmail,
  IsEnum,
  IsNumber,
  Min,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ROLE } from '../../auth/enums/role.enum';
import { GENDER } from '../enums';

export class PostDto {
  @IsEmail()
  @ApiProperty()
  public email: string;

  @IsString()
  @ApiProperty()
  public password: string;

  @IsEnum(ROLE)
  @ApiProperty({ description: 'ADMIN or USER only' })
  role: string;

  @IsString()
  @ApiProperty()
  first_name: string;

  @IsString()
  @ApiProperty()
  last_name: string;

  @IsString()
  @ApiProperty()
  phone: string;

  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  address: string;

  @IsEnum(GENDER)
  @ApiProperty({ description: 'Use M(man) or W(women) or O(other)' })
  gender: string;

  @IsString()
  @IsDateString({ strict: true }, { message: 'Format valid is "yyyy-mm-dd"' })
  @ApiProperty()
  birth_date: string;

  @IsNumber()
  @ApiProperty()
  @Min(1)
  city_id: number;

  @IsString()
  @ApiProperty()
  category: string;

  @IsString()
  @ApiProperty()
  document_id: string;
}
