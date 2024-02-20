import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthJwtModule } from '../../global/modules';
import { AdminModule } from '../admin/admin.module';
import { CryptoServiceProvider } from '../crypto/crypto.provider';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports: [AdminModule, PassportModule, AuthJwtModule],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, CryptoServiceProvider],
})
export class AuthModule {}
