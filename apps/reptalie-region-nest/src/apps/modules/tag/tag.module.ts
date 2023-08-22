import { Module } from '@nestjs/common';
import { MongooseModuleTag } from 'src/apps/utils/customModules';
import { TagWriterServiceProvider, TagSearcherServiceProvider } from './tag.providers';
import { TagRepository } from './tag.repository';

@Module({
    imports: [MongooseModuleTag],
    controllers: [],
    providers: [TagRepository, TagWriterServiceProvider, TagSearcherServiceProvider],
    exports: [TagRepository, TagWriterServiceProvider, TagSearcherServiceProvider],
})
export class TagModule {}
