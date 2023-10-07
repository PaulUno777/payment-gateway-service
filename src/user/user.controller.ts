import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CurrentUser, HasRole } from '@app/common';
import { UserRes } from './dto/user.res';
import { RoleType } from '@prisma/client';

@Controller('user')
@ApiTags('Current User')
@HasRole(RoleType.super_admin, RoleType.manage_users, RoleType.all)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth('jwt-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Returns authentification tokens',
    type: UserRes,
  })
  @ApiOperation({ summary: 'Get current logged user infos' })
  @Get()
  findOne(@CurrentUser('sub') id: string) {
    return this.userService.findOne(id);
  }
}
