import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class TikTokPublisher {
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
        'https://open.tiktokapis.com/v1/video/upload/init/',
        {
          source_info: {
            source: 'EXTERNAL_PLATFORM',
            platform: 'SOCIALHUB',
          },
          video_info: {
            description: content,
            disable_duet: false,
            disable_stitch: false,
            disable_comment: false,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${account.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.data.upload_id;
    } catch (error) {
      throw new Error(`Failed to publish to TikTok: ${error}`);
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
        'https://open.tiktokapis.com/v1/video/query/',
        {
          params: {
            fields: 'id,share_count,view_count,like_count,comment_count',
            video_ids: [postId],
          },
          headers: {
            Authorization: `Bearer ${account.accessToken}`,
          },
        },
      );

      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to fetch TikTok analytics: ${error}`);
    }
  }
}
