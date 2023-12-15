import { Module } from '@nestjs/common';
import { MongooseModuleMetaData } from '../../utils/customModules';
import { MetaDataController } from './metaData.controller';
import {
    MetaDataDeleterServiceProvider,
    MetaDataSearcherServiceProvider,
    MetaDataUpdaterServiceProvider,
    MetaDataWriterServiceProvider,
} from './metaData.provider';
import { MetaDataRepository } from './repository/metaData.repository';

@Module({
    imports: [MongooseModuleMetaData],
    controllers: [MetaDataController],
    providers: [
        MetaDataRepository,
        MetaDataDeleterServiceProvider,
        MetaDataSearcherServiceProvider,
        MetaDataUpdaterServiceProvider,
        MetaDataWriterServiceProvider,
    ],
    exports: [
        MetaDataDeleterServiceProvider,
        MetaDataSearcherServiceProvider,
        MetaDataUpdaterServiceProvider,
        MetaDataWriterServiceProvider,
    ],
})
export class MetaDataModule {}
