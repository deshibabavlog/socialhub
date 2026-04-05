import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBrandDto, UpdateBrandDto } from './dtos';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBrandDto) {
    const slug = this.generateSlug(dto.name);
    
    return this.prisma.brand.create({
      data: {
        userId,
        name: dto.name,
        slug,
        description: dto.description,
        website: dto.website,
        logo: dto.logo,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.brand.findMany({
      where: { userId },
      include: {
        accounts: true,
      },
    });
  }

  async findById(id: string, userId: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        accounts: true,
        analytics: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      },
    });

    if (!brand || brand.userId !== userId) {
      throw new NotFoundException('Brand not found');
    }

    return brand;
  }

  async update(id: string, userId: string, dto: UpdateBrandDto) {
    const brand = await this.findById(id, userId);

    return this.prisma.brand.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string, userId: string) {
    const brand = await this.findById(id, userId);

    return this.prisma.brand.delete({
      where: { id },
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
