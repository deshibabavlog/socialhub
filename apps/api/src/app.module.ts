import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BrandsModule } from './brands/brands.module';
import { OAuthModule } from './oauth/oauth.module';
import { PostsModule } from './posts/posts.module';
import { MediaModule } from './media/media.module';
import { QueueModule } from './queue/queue.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    BrandsModule,
    OAuthModule,
    PostsModule,
    MediaModule,
    QueueModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
