import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [BrandsService, PrismaService],
  controllers: [BrandsController],
})
export class BrandsModule {}
