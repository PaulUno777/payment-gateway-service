import { ConnectionErrorException } from '@app/common';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Observable, catchError, from, map } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly authService: AuthService) {}

  findOne(id: string): Observable<any> {
    return from(this.authService.findOne(id)).pipe(
      map((user) => {
        console.log('user', user);
        delete user.password;
        delete user.isDeleted;
        return user;
      }),
      catchError((error) => {
        if (error.code === 'P2025') throw new NotFoundException();
        throw new ConnectionErrorException();
      }),
    );
  }
}
