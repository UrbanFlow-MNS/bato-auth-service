import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './domain/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenEntity } from './domain/entities/refresh-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [UserEntity, RefreshTokenEntity],
      synchronize: true, // TODO: à désactiver en production
    }),

    TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity]),

    JwtModule.register({
      secret: 'secret_jwt' // TODO: mettre dans une variable d'environnement
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
