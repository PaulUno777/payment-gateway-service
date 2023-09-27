import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BasicStrategy } from 'passport-http';
import { ApiClientService } from 'src/api-client/api-client.service';
import { Request } from 'express';
import { RoleType } from '@prisma/client';

@Injectable()
export class HttpAuthStrategy extends PassportStrategy(BasicStrategy, 'basic') {
  constructor(private apiClientService: ApiClientService) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(req: Request): Promise<any> {
    const encodedCredentials = req
      .get('authorization')
      .replace('Basic', '')
      .trim();
    const decodedCredentials = Buffer.from(
      encodedCredentials,
      'base64',
    ).toString('utf-8');
    const [username, password] = decodedCredentials.split(':');
    const apiClient = await this.apiClientService.validate(username, password);

    if (!apiClient) {
      throw new UnauthorizedException();
    }
    return {
      sub: apiClient.id,
      email: apiClient.apiKey,
      role: RoleType.client_manager,
    };
  }
}
