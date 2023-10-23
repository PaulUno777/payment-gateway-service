import { TransactionEntity } from '@app/common/types';
import { ApiProperty } from '@nestjs/swagger';
import { ProviderCode } from '@prisma/client';

export class OperationResponse {
  @ApiProperty({ description: '' })
  message: string;
  @ApiProperty({ description: '' })
  data: TransactionEntity;
}
export class UserInfo {
  @ApiProperty({ description: '', default: 'firstname' })
  firstName: string;
  @ApiProperty({ description: '', default: 'lastname' })
  lastName: string;
  @ApiProperty({ description: '', default: 'fullname' })
  fullName: string;
  @ApiProperty({ description: '', default: 'TOTO_MONEY' })
  provider: ProviderCode;
  @ApiProperty({ description: '', default: '252538768' })
  msisdn: string;
}
