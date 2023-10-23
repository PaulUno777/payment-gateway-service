import { ConnectionErrorException } from '@app/common';
import { AuthPrismaService } from '@app/common/prisma/auth.prisma.service';
import { User } from '@app/common/prisma/client-auth';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Observable, catchError, from, map } from 'rxjs';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly prisma: AuthPrismaService) {}

  findOne(id: string): Observable<User> {
    return from(this.prisma.user.findFirstOrThrow({ where: { id: id } })).pipe(
      map((user) => {
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
