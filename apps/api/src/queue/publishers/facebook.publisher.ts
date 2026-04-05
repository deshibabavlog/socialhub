import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class FacebookPublisher {
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
        `https://graph.facebook.com/v18.0/${account.accountId}/feed`,
        {
          message: content,
          access_token: account.accessToken,
        },
      );

      return response.data.id;
    } catch (error) {
      throw new Error(`Failed to publish to Facebook: ${error}`);
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
        `https://graph.facebook.com/v18.0/${postId}/insights`,
        {
          params: {
            metric: 'engagement,impressions,reach',
            access_token: account.accessToken,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch Facebook analytics: ${error}`);
    }
  }
}
