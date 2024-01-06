import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { controllerErrorHandler } from '../../../../dist/apps/utils/error/errorHandler';
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
        try {
            return this.metaDataWriterService.createMetaData(body.name, body.values);
        } catch (error) {
            controllerErrorHandler(error);
        }
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
