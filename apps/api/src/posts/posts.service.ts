import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePostDto, UpdatePostDto } from './dtos';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, brandId: string, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        userId,
        brandId,
        title: dto.title,
        content: dto.content,
        platforms: dto.platforms || [],
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        status: 'draft',
      },
      include: {
        media: {
          include: { media: true },
        },
      },
    });
  }

  async findAll(userId: string, brandId?: string, status?: string) {
    const where: any = { userId };
    if (brandId) where.brandId = brandId;
    if (status) where.status = status;

    return this.prisma.post.findMany({
      where,
      include: {
        media: {
          include: { media: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        media: {
          include: { media: true },
        },
      },
    });

    if (!post || post.userId !== userId) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(id: string, userId: string, dto: UpdatePostDto) {
    const post = await this.findById(id, userId);

    return this.prisma.post.update({
      where: { id },
      data: {
        title: dto.title,
        content: dto.content,
        platforms: dto.platforms,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
      },
      include: {
        media: {
          include: { media: true },
        },
      },
    });
  }

  async delete(id: string, userId: string) {
    const post = await this.findById(id, userId);

    return this.prisma.post.delete({
      where: { id },
    });
  }

  async attachMedia(postId: string, mediaIds: string[]) {
    const existingMedia = await this.prisma.postMedia.findMany({
      where: { postId },
    });

    // Delete removed media
    const toDelete = existingMedia
      .filter((m) => !mediaIds.includes(m.mediaId))
      .map((m) => m.id);

    if (toDelete.length > 0) {
      await this.prisma.postMedia.deleteMany({
        where: { id: { in: toDelete } },
      });
    }

    // Add new media
    const existingIds = new Set(existingMedia.map((m) => m.mediaId));
    const toAdd = mediaIds.filter((id) => !existingIds.has(id));

    for (let i = 0; i < toAdd.length; i++) {
      await this.prisma.postMedia.create({
        data: {
          postId,
          mediaId: toAdd[i],
          order: i,
        },
      });
    }

    return this.findById(postId, (await this.prisma.post.findUnique({ where: { id: postId } }))!.userId);
  }

  async publishPost(id: string, userId: string) {
    const post = await this.findById(id, userId);

    return this.prisma.post.update({
      where: { id },
      data: {
        status: 'published',
        publishedAt: new Date(),
      },
      include: {
        media: {
          include: { media: true },
        },
      },
    });
  }

  async schedulePost(id: string, userId: string, scheduledAt: Date) {
    const post = await this.findById(id, userId);

    return this.prisma.post.update({
      where: { id },
      data: {
        status: 'scheduled',
        scheduledAt,
      },
      include: {
        media: {
          include: { media: true },
        },
      },
    });
  }
}
