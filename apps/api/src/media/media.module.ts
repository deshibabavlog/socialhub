import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [MediaService, PrismaService],
  controllers: [MediaController],
})
export class MediaModule {}
