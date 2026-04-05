import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async uploadMedia(
    userId: string,
    file: Express.Multer.File,
    metadata?: any,
  ) {
    const key = `${userId}/${Date.now()}_${file.originalname}`;
    const url = `/media/${key}`;

    const [width, height] = await this.extractDimensions(file);

    return this.prisma.media.create({
      data: {
        userId,
        key,
        url,
        type: this.getMediaType(file.mimetype),
        mimeType: file.mimetype,
        size: file.size,
        width,
        height,
        metadata,
      },
    });
  }

  async findById(id: string, userId: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media || media.userId !== userId) {
      throw new NotFoundException('Media not found');
    }

    return media;
  }

  async findAll(userId: string) {
    return this.prisma.media.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string, userId: string) {
    const media = await this.findById(id, userId);

    return this.prisma.media.delete({
      where: { id },
    });
  }

  private getMediaType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'document';
  }

  private async extractDimensions(
    file: Express.Multer.File,
  ): Promise<[number | undefined, number | undefined]> {
    if (!file.mimetype.startsWith('image/')) {
      return [undefined, undefined];
    }

    try {
      // Simplified dimension extraction
      // In production, use sharp or similar library
      return [1920, 1080];
    } catch {
      return [undefined, undefined];
    }
  }
}
