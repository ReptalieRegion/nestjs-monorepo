import { Injectable } from '@nestjs/common';

export const AppleServiceToken = 'AppleServiceToken';

@Injectable()
export class AppleService {
    constructor() {}
}
