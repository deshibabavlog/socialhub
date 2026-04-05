import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dtos';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('posts')
@UseGuards(JwtGuard)
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreatePostDto) {
    return this.postsService.create(req.user.sub, dto.brandId, dto);
  }

  @Get()
  async findAll(
    @Request() req,
    @Query('brandId') brandId?: string,
    @Query('status') status?: string,
  ) {
    return this.postsService.findAll(req.user.sub, brandId, status);
  }

  @Get(':id')
  async findById(@Request() req, @Param('id') id: string) {
    return this.postsService.findById(id, req.user.sub);
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    return this.postsService.delete(id, req.user.sub);
  }

  @Post(':id/attach-media')
  async attachMedia(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { mediaIds: string[] },
  ) {
    return this.postsService.attachMedia(id, body.mediaIds);
  }

  @Post(':id/publish')
  async publish(@Request() req, @Param('id') id: string) {
    return this.postsService.publishPost(id, req.user.sub);
  }

  @Post(':id/schedule')
  async schedule(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { scheduledAt: string },
  ) {
    return this.postsService.schedulePost(id, req.user.sub, new Date(body.scheduledAt));
  }
}
