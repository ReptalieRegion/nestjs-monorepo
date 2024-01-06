import { Injectable } from '@nestjs/common';
import { MetaDataRepository } from '../repository/metaData.repository';

export const MetaDataWriterServiceToken = 'MetaDataWriterServiceToken';

@Injectable()
export class MetaDataWriterService {
    constructor(private readonly metaDataRepository: MetaDataRepository) {}

    async createMetaData(name: string, values: { [key: string]: unknown }) {
        return this.metaDataRepository.createMetaData(name, values);
    }
}
