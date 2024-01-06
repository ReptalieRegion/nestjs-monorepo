import { Injectable } from '@nestjs/common';
import { MetaDataRepository } from '../repository/metaData.repository';

export const MetaDataSearcherServiceToken = 'MetaDataSearcherServiceToken';

@Injectable()
export class MetaDataSearcherService {
    constructor(private readonly metaDataRepository: MetaDataRepository) {}

    async getVarietyMap() {
        return this.metaDataRepository.findOne({ name: 'VARIETY' }).exec();
    }
}
