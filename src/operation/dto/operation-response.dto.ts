import { TransactionEntity } from '@app/common/types';
import { ApiProperty } from '@nestjs/swagger';

export class OperationResponse {
  @ApiProperty({ description: '' })
  message: string;
  @ApiProperty({ description: '' })
  data: TransactionEntity;
}
export class UserInfo {
  @ApiProperty({ description: '' })
  firstName: string;
  @ApiProperty({ description: '' })
  lastName: string;
}
