import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto, UpdateBrandDto } from './dtos';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('brands')
@UseGuards(JwtGuard)
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateBrandDto) {
    return this.brandsService.create(req.user.sub, dto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.brandsService.findAll(req.user.sub);
  }

  @Get(':id')
  async findById(@Request() req, @Param('id') id: string) {
    return this.brandsService.findById(id, req.user.sub);
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    return this.brandsService.delete(id, req.user.sub);
  }
}
