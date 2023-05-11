import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from '../multer/multer.options';

export const CustomMulterModule = MulterModule.registerAsync({
    imports: [ConfigModule],
    useFactory: multerOptionsFactory,
    inject: [ConfigService],
});
