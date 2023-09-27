import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MinLength } from 'class-validator';

export class CreateApiClientReq {
  @MinLength(8)
  @ApiProperty()
  name: string;
  @ApiProperty()
  @IsOptional()
  description?: string;
  @ApiProperty()
  @IsOptional()
  webhookUrl?: string;
}
