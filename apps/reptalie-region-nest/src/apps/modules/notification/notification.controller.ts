import { Controller, Post, Inject, Body, Put, Delete, HttpCode, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { IAgreeStatusDTO } from '../../dto/notification/agree/input-notificationAgree.dto';
import { InputNotificationLogDTO, IMessageIdDTO } from '../../dto/notification/log/input-notificationLog.dto';
import { InputNotificationTemplateDTO } from '../../dto/notification/template/input-notificationTemplate.dto';
import { IResponseUserDTO } from '../../dto/user/user/response-user.dto';
import { controllerErrorHandler } from '../../utils/error/errorHandler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../user/user.decorator';
import { NotificationAgreeService, NotificationAgreeServiceToken } from './service/notificationAgree.service';
import { NotificationLogService, NotificationLogServiceToken } from './service/notificationLog.service';
import { NotificationPushService, NotificationPushServiceToken } from './service/notificationPush.service';
import { NotificationTemplateService, NotificationTemplateServiceToken } from './service/notificationTemplate.service';
import { BaseMessage } from './types';

@Controller('notification')
export class NotificationController {
    constructor(
        @Inject(NotificationPushServiceToken)
        private readonly notificationPushService: NotificationPushService,
        @Inject(NotificationTemplateServiceToken)
        private readonly notificationTemplateService: NotificationTemplateService,
        @Inject(NotificationLogServiceToken)
        private readonly notificationLogService: NotificationLogService,
        @Inject(NotificationAgreeServiceToken)
        private readonly notificationAgreeService: NotificationAgreeService,
    ) {}

    @Post('push/send')
    async send(
        @Body()
        body: ({ type: 'send'; token: string } & BaseMessage) | ({ type: 'sendMulticast'; tokens: string[] } & BaseMessage),
    ) {
        if (body.type === 'send') {
            const { token, type, ...message } = body;
            this.notificationPushService.sendMessage({ token, ...message });
            return;
        }

        if (body.type === 'sendMulticast') {
            const { tokens, type, ...message } = body;
            this.notificationPushService.sendMessage({ tokens: tokens, ...message });
            return;
        }
    }

    // 정규 표현식을 사용하여 변수 추출
    // const matchResult = dto.template.article.match(/\${(.*?)}/g);
    // console.log(matchResult);

    // // 추출된 변수 리스트
    // const variables = matchResult ? matchResult.map((match) => match.replace('${', '').replace('}', '')) : [];
    // console.log(variables);

    // // 각 변수에 대한 값을 가져와서 대체
    // const replacedArticle = variables.reduce((article, variable) => {

    //     return article.replace(`\${${variable}}`, 'sm');
    // }, dto.template.article);

    // console.log(replacedArticle);

    /**
     *
     *  Post
     *
     */
    @Post('push/template')
    @HttpCode(HttpStatus.NO_CONTENT)
    async createTemplate(@Body() dto: InputNotificationTemplateDTO) {
        try {
            switch (dto.provider) {
                case 'PUSH':
                    await this.notificationTemplateService.createPushTemplate(dto);
                    return;
                case 'SMS':
                    console.log('SMS 만들 예정');
                    return;
                case 'LMS':
                    console.log('LMS 만들 예정');
                    return;
            }
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('push/log')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async createLog(@AuthUser() user: IResponseUserDTO, @Body() dto: InputNotificationLogDTO) {
        try {
            return this.notificationLogService.createLog(user.id, dto);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('push/agree')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    async createAgree(@AuthUser() user: IResponseUserDTO, @Body() dto: IAgreeStatusDTO) {
        try {
            await this.notificationAgreeService.createAgree(user.id, dto.isAgree);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    /**
     *
     *  Put
     *
     */
    @Put('push/read')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    async updateIsRead(@AuthUser() user: IResponseUserDTO) {
        try {
            await this.notificationLogService.updateIsRead(user.id);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put('push/click')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    async updateIsClicked(@AuthUser() user: IResponseUserDTO, @Body() dto: IMessageIdDTO) {
        try {
            await this.notificationLogService.updateIsClicked(user.id, dto.messageId);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put('push/agree')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    async updateAgree(@AuthUser() user: IResponseUserDTO, @Body() dto: IAgreeStatusDTO, @Query('type') type: string) {
        try {
            await this.notificationAgreeService.updateAgree(user.id, dto.isAgree, type);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    /**
     *
     *  Delete
     *
     */
    @Delete('push/template')
    deleteAgree(@Body() dto: InputNotificationTemplateDTO) {
        console.log(dto);
    }

    /**
     *
     *  Get
     *
     */
}
