import { SchemaId } from '../common/id';
import { ContentType, TemplateTitleType } from '../enums';

interface BasicTemplate {
    title: TemplateTitleType;
    article: string;
    deepLink: string;
}

interface ProfileContent extends BasicTemplate {
    type: ContentType.Profile;
    profileThumbnail: string;
}

interface SharePostContent extends BasicTemplate {
    type: ContentType.SharePost;
    profileThumbnail: string;
    postThumbnail: string;
}

interface NoticeContent extends BasicTemplate {
    type: ContentType.Notice;
}

type PushLogContents = ProfileContent | SharePostContent | NoticeContent;

interface INotificationLog {
    _id: SchemaId;
    id: string;
    userId: SchemaId;
    templateId: SchemaId;
    messageId: string;
    contents: PushLogContents;
    isRead: boolean;
    isClicked: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { BasicTemplate, ProfileContent, SharePostContent, NoticeContent, PushLogContents, INotificationLog };
