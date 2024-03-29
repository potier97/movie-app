import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
//CONFIG
import envConfig from 'config/env-config';
//SERVICES
import { UserModule } from '../modules/user/user.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
//STRATEGY
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [envConfig.KEY],
      useFactory: async (configService: ConfigType<typeof envConfig>) => {
        const { jwtSecret, jwtExpirationTime } = configService;
        return {
          global: true,
          secret: jwtSecret,
          signOptions: { expiresIn: jwtExpirationTime, algorithm: 'HS256' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
