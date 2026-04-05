import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class InstagramPublisher {
  constructor(private prisma: PrismaService) {}

  async publish(
    accountId: string,
    content: string,
    mediaUrls?: string[],
  ): Promise<string> {
    const account = await this.prisma.oAuthAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) throw new Error('Account not found');

    try {
      const response = await axios.post(
        `https://graph.instagram.com/v18.0/${account.accountId}/media`,
        {
          caption: content,
          media_type: mediaUrls ? 'CAROUSEL' : 'IMAGE',
          image_url: mediaUrls?.[0],
          access_token: account.accessToken,
        },
      );

      return response.data.id;
    } catch (error) {
      throw new Error(`Failed to publish to Instagram: ${error}`);
    }
  }

  async getAnalytics(
    accountId: string,
    postId: string,
  ): Promise<Record<string, any>> {
    const account = await this.prisma.oAuthAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) throw new Error('Account not found');

    try {
      const response = await axios.get(
        `https://graph.instagram.com/v18.0/${postId}/insights`,
        {
          params: {
            metric: 'engagement,impressions,reach',
            access_token: account.accessToken,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch Instagram analytics: ${error}`);
    }
  }
}
