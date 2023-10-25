import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectionErrorException, hashData, verifyHash } from '@app/common';
import { AuthUserRes } from './dto/auth-user.res';
import { AuthUserReq } from './dto/auth-user.req';
import { GetTokenRes } from 'src/auth/dto/get-token.dto copy';
import { SourceType } from '@prisma/client';
import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
import { PrismaService } from '@app/common/prisma';
import { RoleType } from './types/role-type';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private db: Db;
  private client: MongoClient;
  private userCollection: Collection;
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    this.client = new MongoClient(process.env.AUTH_DATABASE_URL);
    this.db = this.client.db(process.env.AUTH_DB_NAME);
    this.userCollection = this.db.collection('administrators');
  }

  async signin(body: AuthUserReq): Promise<AuthUserRes> {
    await this.client.connect();
    const user = await this.userCollection.findOne({
      $or: [{ email: body.login }, { username: body.login }],
      active: true,
      account_deleted: false,
    });

    this.client.close();

    console.log('user', user);
    if (!user) throw new UnauthorizedException('Access denied');

    const pwMatch = await verifyHash(user.password, body.password);

    if (!pwMatch) throw new UnauthorizedException('Access denied');

    //get tokens (login)
    const tokens = await this.getTokens(
      String(user._id),
      user.email,
      user.role,
    );
    this.updateRefreshToken(String(user._id), String(tokens.refreshToken));
    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.refreshTokenStore.updateMany({
      where: {
        id: userId,
        refreshToken: {
          not: null,
        },
      },
      data: { refreshToken: null },
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const token = await this.prisma.refreshTokenStore.findUnique({
      where: { id: userId, refreshToken: { not: null } },
    });
    const user = await this.findOne(userId);
    if (!token || !token.refreshToken || !user)
      throw new UnauthorizedException('Access Denied');

    const rtMatch = await verifyHash(token.refreshToken, refreshToken);
    if (!rtMatch) throw new UnauthorizedException('Access Denied');

    //get tokens (login)
    const tokens = await this.getTokens(
      String(user._id),
      user.email,
      user.role,
    );
    await this.updateRefreshToken(
      String(user._id),
      String(tokens.refreshToken),
    );
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const tokenHash = await hashData(refreshToken);
    try {
      await this.prisma.refreshTokenStore.upsert({
        where: {
          id: userId,
        },
        update: {
          refreshToken: tokenHash,
        },
        create: {
          id: userId,
          refreshToken: tokenHash,
        },
      });
      this.logger.log('Refresh token updated');
    } catch (error) {
      throw new ConnectionErrorException(
        `Something went wrong with data source \n ${error}`,
      );
    }
  }

  async findOne(id: string): Promise<any> {
    await this.client.connect();
    const user = await this.userCollection.findOne({
      _id: new ObjectId(id),
      active: true,
      account_deleted: false,
    });
    await this.client.close();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<AuthUserRes> {
    const [at, rt] = await Promise.all([
      //access token
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
          type: SourceType.ADMIN,
        },
        {
          expiresIn: '3600s',
        },
      ),
      //refresh token
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
          type: SourceType.ADMIN,
        },
        {
          expiresIn: 60 * 60 * 24,
        },
      ),
    ]);

    return {
      authToken: at,
      refreshToken: rt,
    };
  }

  async getAccessToken(sub: string, name: string): Promise<GetTokenRes> {
    const at = await this.jwtService.signAsync(
      {
        sub,
        email: name,
        role: RoleType.api_client,
        type: SourceType.SERVICE,
      },
      {
        expiresIn: 3600,
      },
    );

    return {
      accessToken: at,
      tokenType: 'Bearer',
      expiresIn: 3600,
    };
  }
}
