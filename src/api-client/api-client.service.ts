import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { Observable, catchError, firstValueFrom, from, map } from 'rxjs';
import { ApiClient, RoleType } from '@prisma/client';
import { ConnectionErrorException, PrismaService } from '@app/common';
import { CreateApiClientReq } from './dto/create-api-client.dto';
import { UpdateApiClientReq } from './dto/update-api-client.dto';
import { GetTokenRes } from './dto/get-token.dto copy';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ApiClientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  create(createDto: CreateApiClientReq): Observable<ApiClient> {
    const keys = this.generateKeysPaire();
    const newData = {
      ...createDto,
      apiKey: keys.apiKey,
      secretKey: keys.secretKey,
    };
    return from(this.prisma.apiClient.create({ data: newData })).pipe(
      catchError((error) => {
        if (error.code === 'P2002') {
          // Handle unique constraint violation
          throw new ConflictException('Make sure all property are uniques');
        } else {
          throw new ConnectionErrorException(
            `Something went wrong with data source \n ${error}`,
          );
        }
      }),
    );
  }

  async validate(
    username: string,
    password: string,
  ): Promise<ApiClient | null> {
    const user = await this.prisma.apiClient.findFirst({
      where: { apiKey: username, secretKey: password, isActive: true },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  findAll(): Observable<ApiClient[]> {
    return from(this.prisma.apiClient.findMany()).pipe(
      catchError((error) => {
        throw new ConnectionErrorException(
          `Something went wrong with data source \n ${error}`,
        );
      }),
    );
  }

  async findOne(id: string): Promise<ApiClient> {
    const entity = await this.prisma.apiClient.findFirst({ where: { id: id } });
    if (!entity) {
      throw new NotFoundException('API Client not found');
    }
    return await firstValueFrom(
      from(
        this.prisma.apiClient.findFirst({
          where: { id: id },
        }),
      ).pipe(
        catchError((error) => {
          throw new ConnectionErrorException(
            `Something went wrong with data source \n ${error}`,
          );
        }),
      ),
    );
  }

  async update(id: string, updateReq: UpdateApiClientReq): Promise<ApiClient> {
    const entity = await this.prisma.apiClient.findFirst({ where: { id: id } });
    if (!entity) {
      throw new NotFoundException('API Client not found');
    }
    return await firstValueFrom(
      from(
        this.prisma.apiClient.update({
          where: { id: id },
          data: updateReq,
        }),
      ).pipe(
        catchError((error) => {
          throw new ConnectionErrorException(
            `Something went wrong with data source \n ${error}`,
          );
        }),
      ),
    );
  }

  async toggleActivateState(id: string): Promise<any> {
    const entity = await this.prisma.apiClient.findFirst({ where: { id: id } });
    if (!entity) {
      throw new NotFoundException('API Client not found');
    }
    return await firstValueFrom(
      from(
        this.prisma.apiClient.update({
          where: { id: id },
          data: { isActive: !entity.isActive },
        }),
      ).pipe(
        map((data) => {
          let message;
          data.isActive
            ? (message = { message: 'Api Client activated successfully !' })
            : (message = { message: 'Api Client desactivated successfully!' });
          return message;
        }),
        catchError((error) => {
          throw new ConnectionErrorException(
            `Something went wrong with data source \n ${error}`,
          );
        }),
      ),
    );
  }

  generateKeysPaire() {
    const secret = 'Random secret key';
    const apiKey = crypto
      .createHmac('sha256', secret)
      .update(new Date().toString())
      .digest('hex');

    const secretKey = crypto
      .createHmac('sha256', secret)
      .update(apiKey)
      .digest('hex');

    return {
      apiKey,
      secretKey,
    };
  }

  async getAccessToken(apiId: string, apiKey: string): Promise<GetTokenRes> {
    const token = await this.jwtService.signAsync(
      {
        sub: apiId,
        apiKey,
        role: RoleType.client_manager,
      },
      {
        expiresIn: 3600,
      },
    );

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 3600,
    };
  }
}
