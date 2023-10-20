import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectionErrorException, hashData, verifyHash } from '@app/common';
import { RoleType, SourceType, User } from '@prisma/client';
import { AuthUserRes } from './dto/auth-user.res';
import { AuthUserReq } from './dto/auth-user.req';
import { GetTokenRes } from 'src/api-client/dto/get-token.dto copy';
import { PrismaService } from '@app/common/prisma';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(body: AuthUserReq): Promise<AuthUserRes> {
    try {
      //create user
      const user = await this.create(body);
      //get tokens (login)
      const tokens = await this.getTokens(user.id, user.email, user.role);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      if (error.status === 409) {
        // Handle unique constraint violation
        throw new ConflictException('User with this email already exists');
      } else {
        console.log('error', error);
        throw new ConnectionErrorException(
          `Something went wrong with data source \n ${error}`,
        );
      }
    }
  }

  async signin(body: AuthUserReq): Promise<AuthUserRes> {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email, isActive: true, isDeleted: false },
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
    await this.prisma.user.updateMany({
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
    const user = await this.prisma.user.findUnique({
      where: { id: userId, refreshToken: { not: null }, isActive: true },
    });
    if (!user || !user.refreshToken)
      throw new UnauthorizedException('Access Denied');

    const rtMatch = await verifyHash(user.refreshToken, refreshToken);
    if (!rtMatch) throw new UnauthorizedException('Access Denied');

    //get tokens (login)
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, String(tokens.refreshToken));
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const tokenHash = await hashData(refreshToken);
    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
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

  async create(authUserDto: AuthUserReq): Promise<User> {
    const hashedPassword = await hashData(authUserDto.password);
    try {
      return await this.prisma.user.create({
        data: {
          email: authUserDto.email,
          username: authUserDto.email,
          password: hashedPassword,
          role: RoleType.new_role,
        },
      });
      //get tokens (login)
    } catch (error) {
      if (error.code === 'P2002') {
        // Handle unique constraint violation
        throw new ConflictException('User with this email already exists');
      } else {
        // Handle other errors
        throw new ConnectionErrorException(
          `Something went wrong with data source \n ${error}`,
        );
      }
    }
  }
}
