/* eslint-disable prettier/prettier */
import { AuthGuard } from '@nestjs/passport';

export class RefreshTokenGard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
}
