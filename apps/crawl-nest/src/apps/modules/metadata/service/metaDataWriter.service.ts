import { Injectable } from '@nestjs/common';

export const MetaDataWriterServiceToken = 'MetaDataWriterServiceToken';

@Injectable()
export class MetaDataWriterService {
    constructor() {}
}
