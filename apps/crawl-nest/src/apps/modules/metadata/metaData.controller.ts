import { Controller, Get, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { MetaDataSearcherService, MetaDataSearcherServiceToken } from './service/metaDataSearcher.service';

@Controller('metadata')
export class MetaDataController {
    constructor(
        @Inject(MetaDataSearcherServiceToken)
        private readonly metaDataSearcherService: MetaDataSearcherService,
    ) {}

    /**
     *
     *  Post
     *
     */

    /**
     *
     *  Put
     *
     */

    /**
     *
     *  Delete
     *
     */

    /**
     *
     *  Get
     *
     */
    @Get('variety')
    @HttpCode(HttpStatus.OK)
    async getVarietyMap() {
        return this.metaDataSearcherService.getVarietyMap();
    }

    @Get('remote-config')
    @HttpCode(HttpStatus.OK)
    async getRemoteConfig() {
        return this.metaDataSearcherService.getRemoteConfig();
    }
}
