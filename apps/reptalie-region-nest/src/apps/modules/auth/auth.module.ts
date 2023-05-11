import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { PBKDF2Service } from '../../utils/cryptography/pbkdf2';
import { CustomJwtModule, MongooseModuleUser } from '../../utils/customModules';
import { RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/redis.service';
import { UserRepository } from '../user/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports: [MongooseModuleUser, CustomJwtModule, PassportModule, RedisModule],
    controllers: [AuthController],
    providers: [AuthService, PBKDF2Service, LocalStrategy, JwtStrategy, UserRepository, RedisService],
    exports: [PBKDF2Service, AuthService, JwtStrategy, RedisService],
})
export class AuthModule {}
