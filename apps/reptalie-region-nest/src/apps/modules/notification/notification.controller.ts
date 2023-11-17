import { Controller, Post, Inject, Body, Put, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { IAgreeStatus } from '../../dto/notification/agree/input-notificationAgree.dto';
import { InputNotificationLogDTO } from '../../dto/notification/log/input-notificationLog.dto';
import { InputNotificationTemplateDTO } from '../../dto/notification/template/input-notificationTemplate.dto';
import { IResponseUserDTO } from '../../dto/user/user/response-user.dto';
import { controllerErrorHandler } from '../../utils/error/errorHandler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../user/user.decorator';
import { NotificationAgreeService, NotificationAgreeServiceToken } from './service/notificationAgree.service';
import { NotificationLogService, NotificationLogServiceToken } from './service/notificationLog.service';
import { NotificationPushService, NotificationPushServiceToken } from './service/notificationPush.service';
import { NotificationTemplateService, NotificationTemplateServiceToken } from './service/notificationTemplate.service';

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
    async send(@Body() body: { type: 'send'; token: string } | { type: 'sendMulticast'; tokens: string[] }) {
        /** 임시 데이터 */
        const temp = {
            data: {
                notifee: {
                    title: '진짜 가니??',
                    body: '해치웠나?',
                },
            },
            notification: {
                title: '진짜 가니??',
                body: '해치웠나?',
            },
            apns: {
                payload: {
                    aps: {
                        contentAvailable: true,
                        mutableContent: true,
                    },
                },
            },
        };

        switch (body.type) {
            case 'send':
                this.notificationPushService.sendMessage({ token: body.token, ...temp });
                return;
            case 'sendMulticast':
                this.notificationPushService.sendMessage({ tokens: body.tokens, ...temp });
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
    async createAgree(@AuthUser() user: IResponseUserDTO, @Body() dto: IAgreeStatus) {
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
    updateRead(@Body() dto: InputNotificationTemplateDTO) {
        console.log(dto);
    }

    @Put('push/click')
    updateClick(@Body() dto: InputNotificationTemplateDTO) {
        console.log(dto);
    }

    @Put('push/agree')
    updateAgree(@Body() dto: InputNotificationTemplateDTO) {
        console.log(dto);
    }

    /**
     *
     *  Delete
     *
     */
    @Delete('push/agree')
    deleteAgree(@Body() dto: InputNotificationTemplateDTO) {
        console.log(dto);
    }

    /**
     *
     *  Get
     *
     */
}
