import { ApiProperty } from '@nestjs/swagger';
import { ProviderCode } from '@prisma/client';
import { IsIn, IsString } from 'class-validator';
export class StatusRequest {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  payToken: string;

  @ApiProperty()
  @IsString()
  mouvement: string;

  @ApiProperty()
  @IsIn(Object.keys(ProviderCode))
  providerCode: string;
}
