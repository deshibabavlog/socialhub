import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { PrismaService } from '../prisma.service';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('posts') private postsQueue: Queue,
    private prisma: PrismaService,
  ) {}

  async schedulePost(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) return;

    const delay = post.scheduledAt
      ? post.scheduledAt.getTime() - Date.now()
      : 0;

    return this.postsQueue.add(
      { postId, platforms: post.platforms },
      {
        delay: Math.max(0, delay),
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    );
  }

  async retryPost(postId: string) {
    return this.schedulePost(postId);
  }
}
