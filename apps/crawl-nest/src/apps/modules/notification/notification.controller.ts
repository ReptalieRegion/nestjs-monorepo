import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Post, Put, Query, UseGuards } from '@nestjs/common';
import { IAgreeStatusDTO } from '../../dto/notification/agree/input-notificationAgree.dto';
import { IMessageIdDTO, InputNotificationLogDTO } from '../../dto/notification/log/input-notificationLog.dto';
import { InputNotificationTemplateDTO } from '../../dto/notification/template/input-notificationTemplate.dto';
import { IUserProfileDTO } from '../../dto/user/user/user-profile.dto';
import { ValidationPipe } from '../../utils/error/validator/validator.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../user/user.decorator';
import { NotificationAgreeService, NotificationAgreeServiceToken } from './service/notificationAgree.service';
import { NotificationLogService, NotificationLogServiceToken } from './service/notificationLog.service';
import { NotificationPushService, NotificationPushServiceToken } from './service/notificationPush.service';
import { NotificationSlackService, NotificationSlackServiceToken } from './service/notificationSlack.service';
import { NotificationTemplateService, NotificationTemplateServiceToken } from './service/notificationTemplate.service';
import { NotificationPushParams } from './types/notificationPush.types';

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
        @Inject(NotificationSlackServiceToken)
        private readonly notificationSlackService: NotificationSlackService,
    ) {}

    @Post('push/send')
    async send(@Body() body: { token: string | undefined; pushParams: NotificationPushParams }) {
        this.notificationPushService.sendMessage(body.token, body.pushParams);
    }

    @Post('push/sendMulticast')
    async sendMulticast(@Body() body: { tokens: string[] | undefined; pushParams: NotificationPushParams }) {
        this.notificationPushService.sendMulticastMessage(body.tokens, body.pushParams);
    }

    @Post('slack/send')
    async sendSlack(@Body() body: { text: string }) {
        this.notificationSlackService.send(body.text);
    }

    /**
     *
     *  Post
     *
     */
    @Post('push/template')
    @HttpCode(HttpStatus.NO_CONTENT)
    async createTemplate(@Body(new ValidationPipe(-4501)) dto: InputNotificationTemplateDTO) {
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
    }

    @Post('push/log')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async createLog(@AuthUser() user: IUserProfileDTO, @Body(new ValidationPipe(-4502)) dto: InputNotificationLogDTO) {
        return this.notificationLogService.createLog(user.id, dto);
    }

    @Post('push/agree')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async createAgree(@AuthUser() user: IUserProfileDTO) {
        return this.notificationAgreeService.createAgree(user.id);
    }

    /**
     *
     *  Put
     *
     */
    @Put('push/read')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    async updateIsRead(@AuthUser() user: IUserProfileDTO) {
        await this.notificationLogService.updateIsRead(user.id);
    }

    @Put('push/click')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    async updateIsClicked(@AuthUser() user: IUserProfileDTO, @Body() dto: IMessageIdDTO) {
        await this.notificationLogService.updateIsClicked(user.id, dto.messageId);
    }

    @Put('push/agree')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    async updateAgree(@AuthUser() user: IUserProfileDTO, @Body() dto: IAgreeStatusDTO, @Query('type') type: string) {
        await this.notificationAgreeService.updateAgree(user.id, dto.isAgree, type);
    }

    /**
     *
     *  Delete
     *
     */
    @Delete('push/template')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteTemplate(@Body(new ValidationPipe(-4501)) dto: InputNotificationTemplateDTO) {
        await this.notificationTemplateService.deleteTemplate(dto);
    }

    /**
     *
     *  Get
     *
     */
    @Get('push/log')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async getLogsInfiniteScroll(@AuthUser() user: IUserProfileDTO, @Query('pageParam') pageParam: number) {
        pageParam = isNaN(Number(pageParam)) ? 0 : Number(pageParam);
        return this.notificationLogService.getLogsInfiniteScroll(user.id, pageParam, 10);
    }

    @Get('push/agree')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async getAgreeInfo(@AuthUser() user: IUserProfileDTO) {
        return this.notificationAgreeService.getAgreeInfo(user.id);
    }

    @Get('push/read-check')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async getReadAllCheck(@AuthUser() user: IUserProfileDTO) {
        return this.notificationLogService.checkAllRead(user.id);
    }
}
