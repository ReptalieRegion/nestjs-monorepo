import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './apps/app.module';
import { setup } from './setup';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    setup(app);

    console.log(process.env.PORT);

    await app.listen(process.env.PORT || 3333);
}

bootstrap();
