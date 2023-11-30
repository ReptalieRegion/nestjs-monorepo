import { Injectable } from '@nestjs/common';

export const DiaryWriterServiceToken = 'DiaryWriterServiceToken';

@Injectable()
export class DiaryWriterService {
    constructor() {}
}
