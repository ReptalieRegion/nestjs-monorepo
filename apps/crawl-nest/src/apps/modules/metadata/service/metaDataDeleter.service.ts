import { Injectable } from '@nestjs/common';

export const MetaDataDeleterServiceToken = 'MetaDataDeleterServiceToken';

@Injectable()
export class MetaDataDeleterService {
    constructor() {}
}
