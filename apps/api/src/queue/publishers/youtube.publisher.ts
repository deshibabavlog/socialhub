import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class YouTubePublisher {
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
        'https://www.googleapis.com/youtube/v3/videos?part=snippet,status',
        {
          snippet: {
            title: content.substring(0, 100),
            description: content,
            tags: ['socialhub'],
            categoryId: '22',
          },
          status: {
            privacyStatus: 'unlisted',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${account.accessToken}`,
          },
        },
      );

      return response.data.id;
    } catch (error) {
      throw new Error(`Failed to publish to YouTube: ${error}`);
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
        'https://youtubeanalytics.googleapis.com/v2/reports',
        {
          params: {
            ids: `channel==${postId}`,
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            metrics: 'views,estimatedMinutesWatched,likes,comments,shares',
          },
          headers: {
            Authorization: `Bearer ${account.accessToken}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch YouTube analytics: ${error}`);
    }
  }
}
