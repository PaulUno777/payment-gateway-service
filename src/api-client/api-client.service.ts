import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { Observable, catchError, from, map, switchMap } from 'rxjs';
import { ApiClient } from '@prisma/client';
import { ConnectionErrorException } from '@app/common';
import { CreateApiClientReq } from './dto/create-api-client.dto';
import { UpdateApiClientReq } from './dto/update-api-client.dto';
import { GetTokenRes } from './dto/get-token.dto copy';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@app/common/prisma';
import { RoleType } from 'src/auth/types/role-type';

@Injectable()
export class ApiClientService {
  private readonly logger = new Logger(ApiClientService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  create(
    createDto: CreateApiClientReq,
  ): Observable<{ message: string; entity: ApiClient }> {
    this.logger.log('Registering a new API client ...');

    return from(this.prisma.apiClient.create({ data: createDto })).pipe(
      switchMap((response) => {
        const { apiKey, secretKey } = this.generateKeysPaire(response.id);
        return from(
          this.prisma.apiClient.update({
            where: { id: response.id },
            data: {
              apiKey,
              secretKey,
            },
          }),
        ).pipe(
          map((response) => {
            return { message: 'Registered successfully', entity: response };
          }),
        );
      }),
      catchError((error) => {
        if (error.code === 'P2002') {
          // Handle unique constraint violation
          throw new ConflictException(
            'Ensure that all properties required as unique are unique',
          );
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
    this.logger.log('Finding all API clients ...');
    return from(this.prisma.apiClient.findMany()).pipe(
      catchError((error) => {
        throw new ConnectionErrorException(
          `Something went wrong with data source \n ${error}`,
        );
      }),
    );
  }

  findOne(id: string): Observable<ApiClient> {
    this.logger.log('Finding API client by id ...');
    return from(
      this.prisma.apiClient.findFirstOrThrow({
        where: { id: id },
      }),
    ).pipe(
      catchError((error) => {
        if (error.code === 'P2025') throw new NotFoundException();
        throw new ConnectionErrorException(
          `Something went wrong with data source \n ${error}`,
        );
      }),
    );
  }

  update(
    id: string,
    updateReq: UpdateApiClientReq,
  ): Observable<{ message: string; entity: ApiClient }> {
    this.logger.log('Updating API client ...');
    return this.findOne(id).pipe(
      switchMap((entity) => {
        return from(
          this.prisma.apiClient.update({
            where: { id: entity.id },
            data: updateReq,
          }),
        ).pipe(
          catchError((error) => {
            throw new ConnectionErrorException(error);
          }),
        );
      }),
      map((response) => {
        return { message: 'Updated successfully', entity: response };
      }),
      catchError((error) => {
        throw error;
      }),
    );
  }

  toggleActivation(id: string): Observable<any> {
    this.logger.log('Toggle activation state of API client ...');
    return this.findOne(id).pipe(
      switchMap((entity) => {
        return from(
          this.prisma.apiClient.update({
            where: { id: id },
            data: { isActive: !entity.isActive },
          }),
        ).pipe(
          catchError((error) => {
            throw new ConnectionErrorException(error);
          }),
        );
      }),
      map((response) => {
        const message = { message: '' };
        response.isActive
          ? (message.message = 'Api Client activated successfully')
          : (message.message = 'Api Client deactivated successfully');
        return message;
      }),
      catchError((error) => {
        throw error;
      }),
    );
  }

  generateKeysPaire(apiId: string): { apiKey: string; secretKey: string } {
    const apiKey = crypto
      .createHmac('sha256', apiId)
      .update(new Date().toString())
      .digest('hex');

    const secretKey = crypto
      .createHmac('sha256', apiId)
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
        role: RoleType.api_client,
      },
      {
        expiresIn: 3600,
      },
    );

    return {
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn: 3600,
    };
  }
}
