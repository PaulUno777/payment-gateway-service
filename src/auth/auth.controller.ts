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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserRes } from './dto/auth-user.res';
import { AuthUserReq } from './dto/auth-user.req';
import { AuthGuard } from '@nestjs/passport';
import { ApiClientService } from 'src/api-client/api-client.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Returns authentification tokens',
    type: AuthUserRes,
  })
  @ApiOperation({ summary: 'Sign in with email and password' })
  signup(@Body() userDto: AuthUserReq): Promise<AuthUserRes> {
    return this.authService.signup(userDto);
  }

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

  @ApiBearerAuth('jwt-auth')
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout by deleting refresh token' })
  logout(@CurrentUser('sub') userId: any) {
    return this.authService.logout(userId);
  }

  @ApiBearerAuth('jwt-refresh')
  @UseGuards(RefreshTokenGard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with refresh token' })
  refresh(@CurrentUser() user: any): Promise<AuthUserRes> {
    return this.authService.refreshTokens(user['sub'], user['refreshToken']);
  }

  @IsPublic()
  @ApiBearerAuth('basic')
  @UseGuards(AuthGuard('basic'))
  @ApiOperation({ summary: 'Get access token from api client' })
  @Get('token')
  test(@CurrentUser() client: any) {
    console.log(client);
    return this.authService.getAccessToken(client.id, client.apiKey);
  }
}
