import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class LinkedInPublisher {
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
        'https://api.linkedin.com/v2/ugcPosts',
        {
          author: `urn:li:person:${account.accountId}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.PublishText': {
              text: content,
            },
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${account.accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
          },
        },
      );

      return response.data.id;
    } catch (error) {
      throw new Error(`Failed to publish to LinkedIn: ${error}`);
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
        `https://api.linkedin.com/v2/ugcPosts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${account.accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch LinkedIn analytics: ${error}`);
    }
  }
}
