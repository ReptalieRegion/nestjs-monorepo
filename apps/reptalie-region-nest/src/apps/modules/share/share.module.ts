import { Module } from '@nestjs/common';
import { ShareController } from './share.controller';

@Module({
    imports: [],
    controllers: [ShareController],
    providers: [],
    exports: [],
})
export class ShareModule {}
