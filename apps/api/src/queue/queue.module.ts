import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueService } from './queue.service';
import { FacebookPublisher } from './publishers/facebook.publisher';
import { InstagramPublisher } from './publishers/instagram.publisher';
import { YouTubePublisher } from './publishers/youtube.publisher';
import { TikTokPublisher } from './publishers/tiktok.publisher';
import { LinkedInPublisher } from './publishers/linkedin.publisher';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'posts',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
  ],
  providers: [
    QueueService,
    FacebookPublisher,
    InstagramPublisher,
    YouTubePublisher,
    TikTokPublisher,
    LinkedInPublisher,
    PrismaService,
  ],
  exports: [QueueService],
})
export class QueueModule {}
