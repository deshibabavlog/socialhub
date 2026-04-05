import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('media')
@UseGuards(JwtGuard)
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.mediaService.uploadMedia(req.user.sub, file);
  }

  @Get()
  async findAll(@Request() req) {
    return this.mediaService.findAll(req.user.sub);
  }

  @Get(':id')
  async findById(@Request() req, @Param('id') id: string) {
    return this.mediaService.findById(id, req.user.sub);
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    return this.mediaService.delete(id, req.user.sub);
  }
}
