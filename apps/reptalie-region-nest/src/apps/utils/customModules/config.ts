import { ConfigModule } from '@nestjs/config';

export const CustomConfigModule = ConfigModule.forRoot({ cache: true, isGlobal: true });
