import { ApiProperty } from '@nestjs/swagger';
import { MinLength, Min } from 'class-validator';

export class cashInReq {
  @MinLength(12)
  @ApiProperty()
  phoneNumber: string;
  @Min(1)
  @ApiProperty()
  amount: number;
}
