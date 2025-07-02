import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { RefreshTokenDto } from './domain/dtos/refresh-token.dto';
import { UserRegisterDto } from './domain/dtos/user-register.dto';
import { UserResponseDto } from './domain/dtos/user-response.dto';
import { UserSignInCredentials } from './domain/dtos/user-signin-credentials.dto';
import { RefreshTokenEntity } from './domain/entities/refresh-token.entity';
import { UserEntity } from './domain/entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(RefreshTokenEntity) private tokenRepo: Repository<RefreshTokenEntity>,
    private jwtService: JwtService
  ) { }

  async register(body: UserRegisterDto) {
    const hashedPassword = await bcrypt.hash(body.password, 10)
    const user = this.userRepo.create({
      email: body.email,
      password: hashedPassword,
      firstName: body.firstName,
      lastName: body.lastName
    })
    await this.userRepo.save(user)
    
    return new UserResponseDto(
      user.email,
      user.firstName,
      user.lastName,
      this.createToken(user.id, user.email, body.deviceId),
      randomBytes(64).toString('hex')
    )
  }

  async signInWithCredentials(body: UserSignInCredentials) {
    const user = await this.userRepo.findOne({ where: { email: body.email } })
    console.log(user);
    console.log(body.password);
    
    if (!user) {
      throw new Error('User not found !')
    }

    if (!(await bcrypt.compare(body.password, user.password))) {
      throw new Error('Invalid password !')
    }

    const token = this.createToken(user.id, user.email, body.deviceId)
    const refreshToken = randomBytes(64).toString('hex');

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 3);

    const oldRefreshToken = await this.tokenRepo.findOne({ where: { deviceId: body.deviceId, userId: user.id } })
    if (oldRefreshToken) {
      oldRefreshToken.refreshToken = refreshToken
      oldRefreshToken.expiresAt = expiresAt
      await this.tokenRepo.save(oldRefreshToken)
    } else {
      const refreshTokenEntity = this.tokenRepo.create({ userId: user.id, deviceId: body.deviceId, refreshToken, expiresAt })
      await this.tokenRepo.save(refreshTokenEntity)
    }

    return new UserResponseDto(
      user.email,
      user.firstName,
      user.lastName,
      token,
      refreshToken
    )
  }

  async refreshToken(body: RefreshTokenDto) {
    const refreshTokenEntity = await this.tokenRepo.findOne({ where: { deviceId: body.deviceId, refreshToken: body.refreshToken } })

    if (!refreshTokenEntity || refreshTokenEntity.expiresAt < new Date()) {
      throw new Error('Invalid or expirated token!')
    }

    const user = await this.userRepo.findOne({ where: { id: refreshTokenEntity.userId } })
    if (!user) {
      throw new Error('User not found!');
    }

    const token = this.createToken(user.id, user.email, body.deviceId)
    const refreshToken = randomBytes(64).toString('hex');

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 3);

    refreshTokenEntity.refreshToken = refreshToken
    refreshTokenEntity.expiresAt = expiresAt
    await this.tokenRepo.save(refreshTokenEntity)

    return new UserResponseDto(
      user.email,
      user.firstName,
      user.lastName,
      token,
      refreshToken
    )
  }

  async validateUser(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      return null;
    }
  }

  private createToken(userId: number, email: string, deviceId: string) {
    const tokenPayload = { userId: userId, email: email, deviceId: deviceId }
    return this.jwtService.sign(tokenPayload, { expiresIn: '1h' })
  }

}
