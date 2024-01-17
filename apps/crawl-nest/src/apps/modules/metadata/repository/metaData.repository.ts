import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MetaData, MetaDataDocument } from '../../../schemas/metaData.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class MetaDataRepository extends BaseRepository<MetaDataDocument> {
    constructor(@InjectModel(MetaData.name) private readonly metaDataModel: Model<MetaDataDocument>) {
        super(metaDataModel);
    }

    async createMetaData(name: string, data: { [key: string]: unknown }) {
        const metaData = new this.metaDataModel({ name, data });
        this.metaDataModel.create(metaData);
        return metaData;
    }
}
