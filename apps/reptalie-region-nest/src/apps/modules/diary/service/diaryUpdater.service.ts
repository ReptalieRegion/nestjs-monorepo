import { Injectable } from '@nestjs/common';

export const DiaryUpdaterServiceToken = 'DiaryUpdaterServiceToken';

@Injectable()
export class DiaryUpdaterService {
    constructor() {}
}
