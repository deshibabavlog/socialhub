import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import axios from 'axios';

@Injectable()
export class OAuthService {
  constructor(private prisma: PrismaService) {}

  async generateAuthUrl(platform: string, brandId: string): Promise<string> {
    const config = this.getPlatformConfig(platform);
    const state = Buffer.from(JSON.stringify({ brandId, platform })).toString(
      'base64',
    );

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      state,
      scope: config.scope,
      response_type: 'code',
    });

    return `${config.authUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(
    platform: string,
    code: string,
    state: string,
  ): Promise<any> {
    const config = this.getPlatformConfig(platform);
    const decodedState = JSON.parse(
      Buffer.from(state, 'base64').toString('utf-8'),
    );

    const response = await axios.post(config.tokenUrl, {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri,
    });

    return { ...response.data, ...decodedState };
  }

  async storeOAuthAccount(
    userId: string,
    brandId: string,
    platform: string,
    tokenData: any,
  ) {
    const account = await this.prisma.oAuthAccount.upsert({
      where: {
        brandId_platform_accountId: {
          brandId,
          platform,
          accountId: tokenData.account_id || tokenData.user_id,
        },
      },
      update: {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiresAt: tokenData.expires_at
          ? new Date(tokenData.expires_at * 1000)
          : null,
        profileData: tokenData.profile_data,
      },
      create: {
        userId,
        brandId,
        platform,
        accountId: tokenData.account_id || tokenData.user_id,
        accountName: tokenData.account_name || tokenData.name,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiresAt: tokenData.expires_at
          ? new Date(tokenData.expires_at * 1000)
          : null,
        profileData: tokenData.profile_data,
      },
    });

    return account;
  }

  async getConnectedAccounts(brandId: string) {
    return this.prisma.oAuthAccount.findMany({
      where: { brandId },
    });
  }

  async disconnectAccount(accountId: string) {
    return this.prisma.oAuthAccount.delete({
      where: { id: accountId },
    });
  }

  async refreshToken(accountId: string) {
    const account = await this.prisma.oAuthAccount.findUnique({
      where: { id: accountId },
    });

    if (!account || !account.refreshToken) {
      throw new BadRequestException('Cannot refresh token');
    }

    const config = this.getPlatformConfig(account.platform);

    try {
      const response = await axios.post(config.tokenUrl, {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: account.refreshToken,
        grant_type: 'refresh_token',
      });

      return this.prisma.oAuthAccount.update({
        where: { id: accountId },
        data: {
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token || account.refreshToken,
          tokenExpiresAt: response.data.expires_at
            ? new Date(response.data.expires_at * 1000)
            : null,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to refresh token');
    }
  }

  private getPlatformConfig(platform: string) {
    const configs: Record<string, any> = {
      facebook: {
        authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
        tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
        clientId: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        redirectUri: `${process.env.API_URL}/oauth/callback/facebook`,
        scope: 'pages_manage_posts,pages_read_engagement',
      },
      instagram: {
        authUrl: 'https://api.instagram.com/oauth/authorize',
        tokenUrl: 'https://graph.instagram.com/v18.0/access_token',
        clientId: process.env.INSTAGRAM_APP_ID,
        clientSecret: process.env.INSTAGRAM_APP_SECRET,
        redirectUri: `${process.env.API_URL}/oauth/callback/instagram`,
        scope: 'user_profile,pages_manage_metadata',
      },
      youtube: {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        clientId: process.env.YOUTUBE_CLIENT_ID,
        clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
        redirectUri: `${process.env.API_URL}/oauth/callback/youtube`,
        scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
      },
      tiktok: {
        authUrl: 'https://www.tiktok.com/v1/oauth/authorize',
        tokenUrl: 'https://open.tiktokapis.com/v1/oauth/token',
        clientId: process.env.TIKTOK_CLIENT_KEY,
        clientSecret: process.env.TIKTOK_CLIENT_SECRET,
        redirectUri: `${process.env.API_URL}/oauth/callback/tiktok`,
        scope: 'video.upload,video.publish',
      },
      linkedin: {
        authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
        tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
        clientId: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        redirectUri: `${process.env.API_URL}/oauth/callback/linkedin`,
        scope: 'w_member_social,r_liteprofile',
      },
    };

    if (!configs[platform]) {
      throw new BadRequestException(`Platform ${platform} not supported`);
    }

    return configs[platform];
  }
}
