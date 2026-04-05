import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dtos';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @UseGuards(JwtGuard)
  async refresh(@Request() req) {
    return this.authService.refreshTokens(req.user.sub);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async getCurrentUser(@Request() req) {
    return this.authService.getCurrentUser(req.user.sub);
  }
}
