import { Injectable } from '@nestjs/common';

export const MetaDataSearcherServiceToken = 'MetaDataSearcherServiceToken';

@Injectable()
export class MetaDataSearcherService {
    constructor() {}
}
