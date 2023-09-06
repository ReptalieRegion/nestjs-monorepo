import { Injectable } from '@nestjs/common';

export const ShareDeleterServiceToken = 'ShareDeleterServiceToken';

@Injectable()
export class ShareDeleterService {
    constructor() {}
}
