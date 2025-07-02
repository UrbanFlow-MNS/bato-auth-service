import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './domain/dtos/refresh-token.dto';
import { UserRegisterDto } from './domain/dtos/user-register.dto';
import { UserSignInCredentials } from './domain/dtos/user-signin-credentials.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('register')
  async register(data: UserRegisterDto) {
    return await this.authService.register(data)
  }

  @MessagePattern('login')
  async login(data: UserSignInCredentials) {
    return await this.authService.signInWithCredentials(data)
  }

  @MessagePattern('refresh-token')
  async refreshToken(data: RefreshTokenDto) {
    return await this.authService.refreshToken(data)
  }

  @MessagePattern('validate_token')
  async validateToken(data: { token: string }) {
    return this.authService.validateUser(data.token);
  }
}
