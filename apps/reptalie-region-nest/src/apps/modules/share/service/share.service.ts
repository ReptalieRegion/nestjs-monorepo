import { Injectable } from '@nestjs/common';

import { SharePostRepository } from '../repository/sharePost.repository';

@Injectable()
export class ShareService {
    constructor(private readonly sharePostRepository: SharePostRepository) {}
}
