import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @ApiProperty()
  public email: string;

  @IsString()
  @ApiProperty()
  public password: string;
}
