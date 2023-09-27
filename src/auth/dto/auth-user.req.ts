import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches, MinLength } from 'class-validator';

export class AuthUserReq {
  @IsEmail()
  @ApiProperty({ default: 'abc@gmail.com' })
  email: string;
  @MinLength(8)
  @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
    message:
      'the password must be at least 8 characters and contain numbers, special characters and alphabetic characters',
  })
  @ApiProperty()
  password: string;
}
