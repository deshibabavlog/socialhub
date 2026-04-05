import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getAnalyticsForBrand(
    brandId: string,
    startDate: Date,
    endDate: Date,
  ) {
    return this.prisma.analytics.findMany({
      where: {
        brandId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  async getAnalyticsByPlatform(
    brandId: string,
    platform: string,
    days: number = 30,
  ) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.prisma.analytics.findMany({
      where: {
        brandId,
        platform,
        date: { gte: startDate },
      },
      orderBy: { date: 'asc' },
    });
  }

  async recordAnalytics(
    brandId: string,
    platform: string,
    metrics: Record<string, number>,
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.analytics.upsert({
      where: {
        brandId_platform_date: {
          brandId,
          platform,
          date: today,
        },
      },
      update: metrics,
      create: {
        brandId,
        platform,
        date: today,
        ...metrics,
      },
    });
  }

  async getSummary(brandId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const analytics = await this.prisma.analytics.findMany({
      where: {
        brandId,
        date: { gte: startDate },
      },
    });

    const summary = {
      totalViews: 0,
      totalEngagement: 0,
      totalClicks: 0,
      totalShares: 0,
      totalComments: 0,
      totalLikes: 0,
      byPlatform: {} as Record<string, any>,
    };

    for (const record of analytics) {
      summary.totalViews += record.views;
      summary.totalEngagement += record.engagement;
      summary.totalClicks += record.clicks;
      summary.totalShares += record.shares;
      summary.totalComments += record.comments;
      summary.totalLikes += record.likes;

      if (!summary.byPlatform[record.platform]) {
        summary.byPlatform[record.platform] = {
          views: 0,
          engagement: 0,
          clicks: 0,
          shares: 0,
          comments: 0,
          likes: 0,
        };
      }

      summary.byPlatform[record.platform].views += record.views;
      summary.byPlatform[record.platform].engagement += record.engagement;
      summary.byPlatform[record.platform].clicks += record.clicks;
      summary.byPlatform[record.platform].shares += record.shares;
      summary.byPlatform[record.platform].comments += record.comments;
      summary.byPlatform[record.platform].likes += record.likes;
    }

    return summary;
  }
}
