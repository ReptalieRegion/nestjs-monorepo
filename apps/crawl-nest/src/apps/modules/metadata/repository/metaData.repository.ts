import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MetaData, MetaDataDocument } from '@private-crawl/models';
import { Model } from 'mongoose';

import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class MetaDataRepository extends BaseRepository<MetaDataDocument> {
    constructor(@InjectModel(MetaData.name) private readonly metaDataModel: Model<MetaDataDocument>) {
        super(metaDataModel);
    }
}
