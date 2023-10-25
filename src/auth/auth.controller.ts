import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser, IsPublic, RefreshTokenGard } from '@app/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserRes } from './dto/auth-user.res';
import { AuthUserReq } from './dto/auth-user.req';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Returns authentification tokens',
    type: AuthUserRes,
  })
  @ApiOperation({ summary: 'Login with email and password' })
  signin(@Body() userDto: AuthUserReq): Promise<AuthUserRes> {
    return this.authService.signin(userDto);
  }

  @ApiBearerAuth('jwt-refresh')
  @UseGuards(RefreshTokenGard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Returns authentification tokens',
    type: AuthUserRes,
  })
  @ApiOperation({ summary: 'Login with refresh token' })
  refresh(@CurrentUser() user: any): Promise<AuthUserRes> {
    return this.authService.refreshTokens(user['sub'], user['refreshToken']);
  }

  @ApiBearerAuth('jwt-auth')
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout by deleting refresh token' })
  logout(@CurrentUser('sub') userId: any) {
    return this.authService.logout(userId);
  }

  @IsPublic()
  @ApiBearerAuth('basic')
  @UseGuards(AuthGuard('basic'))
  @ApiOperation({ summary: 'Get access token from api client' })
  @Get('token')
  getAccessToken(@CurrentUser() client: any) {
    return this.authService.getAccessToken(client.sub, client.email);
  }
}
