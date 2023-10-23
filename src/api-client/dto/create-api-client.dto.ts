import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl, MinLength } from 'class-validator';

export class CreateApiClientReq {
  @MinLength(8)
  @ApiProperty()
  name: string;
  @ApiProperty()
  @IsOptional()
  description?: string;
  @ApiProperty()
  @IsOptional()
  @IsUrl()
  webhookUrl?: string;
}
