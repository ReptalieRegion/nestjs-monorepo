import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ContentType, InputNotificationLogDTO } from '../../../dto/notification/log/input-notificationLog.dto';
import { TemplateProviderType, TemplateType } from '../../../dto/notification/template/input-notificationTemplate.dto';
import { FirebaseMessagingService, FirebaseMessagingServiceToken } from '../../firebase/service/firebase-messaging.service';
import { UserDeleterService, UserDeleterServiceToken } from '../../user/service/userDeleter.service';
import { DEEP_LINK_LIST, DEEP_LINK_PREFIX, DEFAULT_FCM_MESSAGE } from '../constants/notificationPush.constants';
import { NotificationLogRepository } from '../repository/notificationLog.repository';
import { NotificationTemplateRepository } from '../repository/notificationTemplate.repository';
import { NotifeeIOS, NotificationPushData, NotificationPushParams } from '../types/notificationPush.types';
import { NotificationSlackService, NotificationSlackServiceToken } from './notificationSlack.service';

export const NotificationPushServiceToken = 'NotificationPushServiceToken';

@Injectable()
export class NotificationPushService {
    constructor(
        @Inject(UserDeleterServiceToken)
        private readonly userDeleterService: UserDeleterService,

        @Inject(FirebaseMessagingServiceToken)
        private readonly firebaseAdminService: FirebaseMessagingService,

        @Inject(NotificationSlackServiceToken)
        private readonly notificationSlackService: NotificationSlackService,

        private readonly notificationLogRepository: NotificationLogRepository,
        private readonly notificationTemplateRepository: NotificationTemplateRepository,
    ) {}

    /**
     * 단일 푸시 알림
     */
    async sendMessage(token: string | undefined, pushParams: NotificationPushParams) {
        if (!token) {
            return;
        }

        this._dataGenerator(pushParams).then(({ data, ios, log, android }) => {
            this.firebaseAdminService
                .send({
                    token,
                    data,
                    ...DEFAULT_FCM_MESSAGE.ios(ios),
                    ...DEFAULT_FCM_MESSAGE.android(android),
                })
                .then(() => this._successPush(log))
                .catch((error) => this._failPush(pushParams.userId, error));
        });
    }

    /**
     * 다중 푸시 알림
     */
    async sendMulticastMessage(tokens: string[] | undefined, pushParams: NotificationPushParams) {
        if (!tokens) {
            return;
        }

        this._dataGenerator(pushParams).then(({ data, ios, log, android }) => {
            this.firebaseAdminService
                .sendMulticast({
                    tokens,
                    data,
                    ...DEFAULT_FCM_MESSAGE.ios(ios),
                    ...DEFAULT_FCM_MESSAGE.android(android),
                })
                .then(() => this._successPush(log))
                .catch((error) => this._failPush(pushParams.userId, error));
        });
    }

    private _successPush(log: InputNotificationLogDTO) {
        this.notificationLogRepository.createLog(log);

        this.notificationSlackService.send('*[푸시알림 보내기]* 성공');
    }

    private _failPush(userId: string, error: admin.FirebaseError) {
        console.log(error);
        this.userDeleterService.fcmTokenDelete(userId);
        this.notificationSlackService.send('*[푸시알림 보내기]* 실패', '푸시알림-에러-dev');
    }

    private async _dataGenerator(pushParams: NotificationPushParams): Promise<{
        data: NotificationPushData;
        ios?: NotifeeIOS;
        android?: { imageUrl: string };
        log: InputNotificationLogDTO;
    }> {
        const { article, id, title } = await this._createTemplateArticle(pushParams.type);
        const baseData = {
            data: {
                title,
                body: article,
            },
            log: {
                userId: pushParams.userId,
                templateId: id,
            },
        };

        switch (pushParams.type) {
            case TemplateType.Notice:
                return {
                    data: {
                        ...baseData.data,
                        link: DEEP_LINK_PREFIX + DEEP_LINK_LIST.notice,
                    },
                    log: {
                        ...baseData.log,
                        messageId: this._createUniqueId(),
                        contents: {
                            type: ContentType.Notice,
                            article,
                            title,
                            deepLink: DEEP_LINK_PREFIX + DEEP_LINK_LIST.notice,
                        },
                    },
                };
            case TemplateType.Comment:
                return {
                    data: {
                        ...baseData.data,
                        link: DEEP_LINK_PREFIX + DEEP_LINK_LIST.sharePostDetail(pushParams.postId, 'comment'),
                    },
                    ios: {
                        attachments: [
                            {
                                url: pushParams.postThumbnail,
                            },
                        ],
                    },
                    android: {
                        imageUrl: pushParams.postThumbnail,
                    },
                    log: {
                        ...baseData.log,
                        messageId: this._createUniqueId(),
                        contents: {
                            type: ContentType.SharePost,
                            article,
                            title,
                            deepLink: DEEP_LINK_PREFIX + DEEP_LINK_LIST.sharePostDetail(pushParams.postId, 'comment'),
                            postThumbnail: pushParams.postThumbnail,
                            profileThumbnail: pushParams.userThumbnail,
                        },
                    },
                };
            case TemplateType.Like:
                return {
                    data: {
                        ...baseData.data,
                        link: DEEP_LINK_PREFIX + DEEP_LINK_LIST.sharePostDetail(pushParams.postId, 'like'),
                    },
                    ios: {
                        attachments: [
                            {
                                url: pushParams.postThumbnail,
                            },
                        ],
                    },
                    android: {
                        imageUrl: pushParams.postThumbnail,
                    },
                    log: {
                        ...baseData.log,
                        messageId: this._createUniqueId(),
                        contents: {
                            type: ContentType.SharePost,
                            article,
                            title,
                            deepLink: DEEP_LINK_PREFIX + DEEP_LINK_LIST.sharePostDetail(pushParams.postId, 'like'),
                            postThumbnail: pushParams.postThumbnail,
                            profileThumbnail: pushParams.userThumbnail,
                        },
                    },
                };
            case TemplateType.Follow:
                return {
                    data: {
                        ...baseData.data,
                        link: DEEP_LINK_PREFIX + DEEP_LINK_LIST.sharePostUser(pushParams.userNickname),
                    },
                    ios: {
                        attachments: [
                            {
                                url: pushParams.userThumbnail,
                            },
                        ],
                    },
                    android: {
                        imageUrl: pushParams.userThumbnail,
                    },
                    log: {
                        ...baseData.log,
                        messageId: this._createUniqueId(),
                        contents: {
                            type: ContentType.Profile,
                            article,
                            title,
                            deepLink: DEEP_LINK_PREFIX + DEEP_LINK_LIST.sharePostUser(pushParams.userNickname),
                            profileThumbnail: pushParams.userThumbnail,
                        },
                    },
                };
            default:
                throw new Error('Not Found TemplateType');
        }
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
