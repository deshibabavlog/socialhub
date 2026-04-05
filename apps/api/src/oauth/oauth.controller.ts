import { Controller, Get, Post, Query, Body, UseGuards, Request } from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('oauth')
export class OAuthController {
  constructor(private oauthService: OAuthService) {}

  @Get('authorize/:platform')
  async authorize(@Query('brandId') brandId: string, @Query('platform') platform: string) {
    const authUrl = await this.oauthService.generateAuthUrl(platform, brandId);
    return { authUrl };
  }

  @Post('callback/:platform')
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('platform') platform: string,
  ) {
    const tokenData = await this.oauthService.exchangeCodeForToken(
      platform,
      code,
      state,
    );
    return tokenData;
  }

  @Get('accounts')
  @UseGuards(JwtGuard)
  async getConnectedAccounts(@Query('brandId') brandId: string) {
    return this.oauthService.getConnectedAccounts(brandId);
  }

  @Post('disconnect')
  @UseGuards(JwtGuard)
  async disconnect(@Body() body: { accountId: string }) {
    return this.oauthService.disconnectAccount(body.accountId);
  }

  @Post('refresh')
  @UseGuards(JwtGuard)
  async refresh(@Body() body: { accountId: string }) {
    return this.oauthService.refreshToken(body.accountId);
  }
}
