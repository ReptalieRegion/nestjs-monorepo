import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthJwtModule } from '../../global/modules';
import { AdminModule } from '../admin/admin.module';
import { CryptoServiceProvider } from '../crypto/crypto.provider';
import { AuthController } from './auth.controller';
import { AuthServiceProvider } from './auth.provider';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports: [AdminModule, PassportModule, AuthJwtModule],
    controllers: [AuthController],
    providers: [LocalStrategy, CryptoServiceProvider, AuthServiceProvider],
    exports: [AuthServiceProvider, LocalStrategy],
})
export class AuthModule {}
