import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectionErrorException, hashData, verifyHash } from '@app/common';
import { AuthUserRes } from './dto/auth-user.res';
import { AuthUserReq } from './dto/auth-user.req';
import { GetTokenRes } from 'src/api-client/dto/get-token.dto copy';
import { AuthPrismaService } from '@app/common/prisma/auth.prisma.service';
import { PrismaService } from '@app/common/prisma';
import { SourceType } from '@prisma/client';
import { RoleType } from '@app/common/prisma/client-auth';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly authPrisma: AuthPrismaService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signin(body: AuthUserReq): Promise<AuthUserRes> {
    const user = await this.authPrisma.user.findFirstOrThrow({
      where: {
        OR: [{ email: body.login }, { username: body.login }],
        isActive: true,
        isDeleted: false,
      },
    });

    if (!user) throw new UnauthorizedException('Access denied');

    const pwMatch = await verifyHash(user.password, body.password);

    if (!pwMatch) throw new UnauthorizedException('Access denied');

    //get tokens (login)
    const tokens = await this.getTokens(user.id, user.email, user.role);
    this.updateRefreshToken(user.id, String(tokens.refreshToken));
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
    const user = await this.authPrisma.user.findUnique({
      where: { id: userId, isActive: true, isDeleted: false },
    });
    if (!token || !token.refreshToken || !user)
      throw new UnauthorizedException('Access Denied');

    const rtMatch = await verifyHash(token.refreshToken, refreshToken);
    if (!rtMatch) throw new UnauthorizedException('Access Denied');

    //get tokens (login)
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, String(tokens.refreshToken));
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

  async getAccessToken(apiId: string, apiKey: string): Promise<GetTokenRes> {
    const at = await this.jwtService.signAsync(
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
      accessToken: at,
      tokenType: 'Bearer',
      expiresIn: 3600,
    };
  }
}
