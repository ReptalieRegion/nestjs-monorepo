import { Injectable } from '@nestjs/common';

export const DiarySearcherServiceToken = 'DiarySearcherServiceToken';

@Injectable()
export class DiarySearcherService {
    constructor() {}
}
