import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { MetaDataWriterService, MetaDataWriterServiceToken } from './service/metaDataWriter.service';

@Controller('metadata')
export class MetaDataController {
    constructor(@Inject(MetaDataWriterServiceToken) private readonly metaDataWriterService: MetaDataWriterService) {}

    /**
     *
     *  Post
     *
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() body: { name: string; values: { [key: string]: unknown } }) {
        return this.metaDataWriterService.createMetaData(body.name, body.values);
    }

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
}
