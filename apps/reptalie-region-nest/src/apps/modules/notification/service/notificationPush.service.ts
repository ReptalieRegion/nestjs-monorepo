import { Inject, Injectable } from '@nestjs/common';
import { ContentType, InputNotificationLogDTO } from '../../../dto/notification/log/input-notificationLog.dto';
import { TemplateProviderType, TemplateType } from '../../../dto/notification/template/input-notificationTemplate.dto';
import { FirebaseMessagingService, FirebaseMessagingServiceToken } from '../../firebase/service/firebase-messaging.service';
import { UserDeleterService, UserDeleterServiceToken } from '../../user/service/userDeleter.service';
import { DEEP_LINK_LIST, DEEP_LINK_PREFIX } from '../constants/notificationPush.constants';
import { NotificationLogRepository } from '../repository/notificationLog.repository';
import { NotificationTemplateRepository } from '../repository/notificationTemplate.repository';
import { FCMMessage, FCMMulticastMessage, NotificationPushData, NotificationPushParams } from '../types/notificationPush.types';

export const NotificationPushServiceToken = 'NotificationPushServiceToken';

@Injectable()
export class NotificationPushService {
    constructor(
        @Inject(FirebaseMessagingServiceToken)
        private readonly firebaseAdminService: FirebaseMessagingService,
        @Inject(UserDeleterServiceToken)
        private readonly userDeleterService: UserDeleterService,
        private readonly notificationLogRepository: NotificationLogRepository,
        private readonly notificationTemplateRepository: NotificationTemplateRepository,
    ) {}

    /**
     * 단일 푸시 알림
     */
    async sendMessage(pushParams: NotificationPushParams, message: FCMMessage) {
        this._dataStringify({ data: message.data, pushParams }).then((data) => {
            this.firebaseAdminService
                .send({ ...message, data })
                .then(() => {
                    const logData = this._createPushLogDTO({ data, pushParams });
                    this.notificationLogRepository.createLog(logData);
                })
                .catch(() => {
                    this.userDeleterService.fcmTokenDelete(pushParams.userId);
                });
        });
    }

    /**
     * 다중 푸시 알림
     */
    async sendMulticastMessage(pushParams: NotificationPushParams, message: FCMMulticastMessage) {
        this._dataStringify({ data: message.data, pushParams }).then((data) => {
            this.firebaseAdminService
                .sendMulticast({ ...message, data })
                .then(() => {
                    const logData = this._createPushLogDTO({ data, pushParams });
                    this.notificationLogRepository.createLog(logData);
                })
                .catch(() => {
                    this.userDeleterService.fcmTokenDelete(pushParams.userId);
                });
        });
    }

    /**
     *
     * @param logDto InputNotificationLogDTO
     * @description 푸시알림 로그 생성
     */
    private _createPushLogDTO({
        data,
        pushParams,
    }: {
        data: NotificationPushData;
        pushParams: NotificationPushParams;
    }): InputNotificationLogDTO {
        const defaultLogData = {
            userId: pushParams.userId,
            templateId: data.templateId,
            messageId: data.crawlPushId,
        };

        switch (pushParams.type) {
            case TemplateType.Comment:
            case TemplateType.Like:
                return {
                    ...defaultLogData,
                    contents: {
                        type: ContentType.SharePost,
                        title: data.title,
                        article: data.body,
                        deepLink: data.link,
                        profileThumbnail: pushParams.userThumbnail,
                        postThumbnail: pushParams.postThumbnail,
                    },
                };
            case TemplateType.Notice:
                return {
                    ...defaultLogData,
                    contents: {
                        type: ContentType.Profile,
                        title: data.title,
                        article: data.body,
                        deepLink: data.link,
                    },
                };
            case TemplateType.Follow:
                return {
                    ...defaultLogData,
                    contents: {
                        type: ContentType.Profile,
                        title: data.title,
                        article: data.body,
                        deepLink: data.link,
                        profileThumbnail: pushParams.userThumbnail,
                    },
                };
            default:
                throw new Error('Not Template InvalidType');
        }
    }

    /**
     *
     * @param param0
     * {
     *  data: FCMMessage의 data | FCMMulticastMessage의 data
     *  pushParams: 푸시 알림마다 각각 다른 매개변수
     * }
     * @returns Firebase messing의 data에 담을 변수 { [key: string]: string }
     */
    private async _dataStringify({
        data,
        pushParams,
    }: (Pick<FCMMessage, 'data'> | Pick<FCMMulticastMessage, 'data'>) & { pushParams: NotificationPushParams }) {
        const deepLink = this._getDeepLink(pushParams);
        const link = deepLink ? DEEP_LINK_PREFIX + deepLink : undefined;
        const { article, id, title } = await this._createTemplateArticle(pushParams.type);
        return Object.assign(
            {},
            {
                ...data,
                title,
                body: article,
            },
            {
                link,
                crawlPushId: this._createUniqueId(),
                templateId: id,
            },
        );
    }

    /**
     * @description 유일한 메시지 아이디 생성
     * @returns unique string
     */
    private _createUniqueId() {
        const date = new Date();
        return `${date.getTime()}-${Math.floor(Math.random() * 999)}`;
    }

    /**
     *
     * @param pushParams 푸시 알림마다 각각 다른 매개변수
     * @description 클라이언트에서 푸시알림 클릭 시, 페이지 전환을 위한 link 생성
     * @returns string
     */
    private _getDeepLink(pushParams: NotificationPushParams) {
        switch (pushParams.type) {
            case TemplateType.Comment:
                return DEEP_LINK_LIST.sharePostDetail(pushParams.postId, 'comment');
            case TemplateType.Like:
                return DEEP_LINK_LIST.sharePostDetail(pushParams.postId, 'like');
            case TemplateType.Follow:
                return DEEP_LINK_LIST.sharePostUser(pushParams.articleParams.팔로우한유저);
            case TemplateType.Notice:
            default:
                return undefined;
        }
    }

    /**
     * TODO
     * template를 조회해와서 article에 변수를 주입해서 메시지 생성하는 코드 작성해야함
     */
    private async _createTemplateArticle(type: TemplateType) {
        const templateInfo = await this.notificationTemplateRepository
            .find({ type, provider: TemplateProviderType.PUSH })
            .sort({ version: -1 });

        if (templateInfo.length < 1) {
            throw new Error('Not Found Template');
        }

        const {
            id,
            template: { article, title },
        } = templateInfo[0];
        // 변수 변경하는 로직 추가할 부분

        return { id, title, article };
    }
}
