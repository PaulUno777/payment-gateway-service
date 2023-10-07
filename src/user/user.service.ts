import { ConnectionErrorException } from '@app/common';
import { PrismaService } from '@app/common/prisma';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { Observable, catchError, from, map } from 'rxjs';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: string): Observable<User> {
    return from(this.prisma.user.findFirstOrThrow({ where: { id: id } })).pipe(
      map((user) => {
        delete user.password;
        delete user.refreshToken;
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
