import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class transactionId {
  @IsString()
  @ApiProperty()
  transactionId: string;
}
