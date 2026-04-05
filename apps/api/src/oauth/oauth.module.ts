import { Module } from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { OAuthController } from './oauth.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [OAuthService, PrismaService],
  controllers: [OAuthController],
  exports: [OAuthService],
})
export class OAuthModule {}
