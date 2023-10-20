import { TransactionEntity } from '@app/common/types';
import { ApiProperty } from '@nestjs/swagger';
import { OperatorCode } from '@prisma/client';

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
  operator: OperatorCode;
  @ApiProperty({ description: '', default: '252538768' })
  msisdn: string;
}
