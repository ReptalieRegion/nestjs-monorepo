import { Injectable } from '@nestjs/common';

export const MetaDataUpdaterServiceToken = 'MetaDataUpdaterServiceToken';

@Injectable()
export class MetaDataUpdaterService {
    constructor() {}
}
