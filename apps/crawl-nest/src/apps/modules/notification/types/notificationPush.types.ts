import * as admin from 'firebase-admin';
import { TemplateTitleType, TemplateType } from '../../../dto/notification/template/input-notificationTemplate.dto';

enum AndroidLaunchActivityFlag {
    NO_HISTORY = 0,
    SINGLE_TOP = 1,
    NEW_TASK = 2,
    MULTIPLE_TASK = 3,
    CLEAR_TOP = 4,
    FORWARD_RESULT = 5,
    PREVIOUS_IS_TOP = 6,
    EXCLUDE_FROM_RECENTS = 7,
    BROUGHT_TO_FRONT = 8,
    RESET_TASK_IF_NEEDED = 9,
    LAUNCHED_FROM_HISTORY = 10,
    CLEAR_WHEN_TASK_RESET = 11,
    NEW_DOCUMENT = 12,
    NO_USER_ACTION = 13,
    REORDER_TO_FRONT = 14,
    NO_ANIMATION = 15,
    CLEAR_TASK = 16,
    TASK_ON_HOME = 17,
    RETAIN_IN_RECENTS = 18,
    LAUNCH_ADJACENT = 19,
    MATCH_EXTERNAL = 20,
}

enum AndroidBadgeIconType {
    NONE = 0,
    SMALL = 1,
    LARGE = 2,
}

enum AndroidCategory {
    ALARM = 'alarm',
    CALL = 'call',
    EMAIL = 'email',
    ERROR = 'error',
    EVENT = 'event',
    MESSAGE = 'msg',
    NAVIGATION = 'navigation',
    PROGRESS = 'progress',
    PROMO = 'promo',
    RECOMMENDATION = 'recommendation',
    REMINDER = 'reminder',
    SERVICE = 'service',
    SOCIAL = 'social',
    STATUS = 'status',
    SYSTEM = 'sys',
    TRANSPORT = 'transport',
}

enum AndroidColor {
    RED = 'red',
    BLUE = 'blue',
    GREEN = 'green',
    BLACK = 'black',
    WHITE = 'white',
    CYAN = 'cyan',
    MAGENTA = 'magenta',
    YELLOW = 'yellow',
    LIGHTGRAY = 'lightgray',
    DARKGRAY = 'darkgray',
    GRAY = 'gray',
    LIGHTGREY = 'lightgrey',
    DARKGREY = 'darkgrey',
    AQUA = 'aqua',
    FUCHSIA = 'fuchsia',
    LIME = 'lime',
    MAROON = 'maroon',
    NAVY = 'navy',
    OLIVE = 'olive',
    PURPLE = 'purple',
    SILVER = 'silver',
    TEAL = 'teal',
}

enum AndroidDefaults {
    ALL = -1,
    LIGHTS = 4,
    SOUND = 1,
    VIBRATE = 2,
}

enum AndroidGroupAlertBehavior {
    ALL = 0,
    SUMMARY = 1,
    CHILDREN = 2,
}

enum AndroidFlags {
    FLAG_INSISTENT = 4,
    FLAG_NO_CLEAR = 32,
}

enum AndroidImportance {
    DEFAULT = 3,
    HIGH = 4,
    LOW = 2,
    MIN = 1,
    NONE = 0,
}

enum AndroidVisibility {
    PRIVATE = 0,
    PUBLIC = 1,
    SECRET = -1,
}

enum AndroidStyle {
    BIGPICTURE = 0,
    BIGTEXT = 1,
    INBOX = 2,
    MESSAGING = 3,
}

interface AndroidBigPictureStyle {
    type: AndroidStyle.BIGPICTURE;
    picture: string | number | object;
    title?: string;
    largeIcon?: string | number | object | null;
    summary?: string;
}

interface AndroidBigTextStyle {
    type: AndroidStyle.BIGTEXT;
    text: string;
    title?: string;
    summary?: string;
}

interface AndroidInboxStyle {
    type: AndroidStyle.INBOX;
    lines: string[];
    title?: string;
    summary?: string;
}

interface AndroidMessagingStyle {
    type: AndroidStyle.MESSAGING;
    person: {
        name: string;
        id?: string;
        bot?: boolean;
        important?: boolean;
        icon?: string;
        uri?: string;
    };
    messages: Array<{
        text: string;
        timestamp: number;
        person?: {
            name: string;
            id?: string;
            bot?: boolean;
            important?: boolean;
            icon?: string;
            uri?: string;
        };
    }>;
    title?: string;
    group?: boolean;
}

export type NotifeeAndroid = {
    actions?: Array<{
        pressAction: {
            id: string;
            launchActivity?: string;
            launchActivityFlags?: AndroidLaunchActivityFlag[];
            mainComponent?: string;
        };
        title: string;
        icon?: string;
        input?:
            | true
            | {
                  allowFreeFormInput?: boolean;
                  allowGeneratedReplies?: boolean;
                  choices?: string[];
                  editableChoices?: boolean;
                  placeholder?: string;
              };
    }>;
    asForegroundService?: boolean;
    lightUpScreen?: boolean;
    autoCancel?: boolean;
    badgeCount?: number;
    badgeIconType?: AndroidBadgeIconType;
    category?: AndroidCategory;
    channelId?: string;
    color?: AndroidColor | string;
    colorized?: boolean;
    chronometerDirection?: 'up' | 'down';
    defaults?: AndroidDefaults[];
    groupId?: string;
    groupAlertBehavior?: AndroidGroupAlertBehavior;
    groupSummary?: boolean;
    inputHistory?: string[];
    largeIcon?: string | number | object;
    circularLargeIcon?: boolean;
    lights?: [AndroidColor | string, number, number];
    localOnly?: boolean;
    ongoing?: boolean;
    loopSound?: boolean;
    flags?: AndroidFlags[];
    onlyAlertOnce?: boolean;
    pressAction?: {
        id: string;
        launchActivity?: string;
        launchActivityFlags?: AndroidLaunchActivityFlag[];
        mainComponent?: string;
    };
    fullScreenAction?: {
        id: string;
        launchActivity?: string;
        launchActivityFlags?: AndroidLaunchActivityFlag[];
        mainComponent?: string;
    };
    importance?: AndroidImportance;
    progress?: {
        max?: number;
        current?: number;
        indeterminate?: boolean;
    };
    showTimestamp?: boolean;
    smallIcon?: string;
    smallIconLevel?: number;
    sortKey?: string;
    style?: AndroidBigPictureStyle | AndroidBigTextStyle | AndroidInboxStyle | AndroidMessagingStyle;
    ticker?: string;
    timeoutAfter?: number;
    showChronometer?: boolean;
    vibrationPattern?: number[];
    visibility?: AndroidVisibility;
    tag?: string;
    timestamp?: number;
    sound?: string;
};

export type NotifeeIOS = {
    attachments?: Array<{
        id?: string;
        url: string;
        typeHint?: string;
        thumbnailHidden?: boolean;
        thumbnailClippingRect?: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        thumbnailTime?: number;
    }>;
    badgeCount?: number | null;
    categoryId?: string;
    launchImageName?: string;
    sound?: string;
    interruptionLevel?: 'active' | 'critical' | 'passive' | 'timeSensitive';
    critical?: boolean;
    criticalVolume?: number;
    threadId?: string;
    summaryArgument?: string;
    summaryArgumentCount?: number;
    targetContentId?: string;
    foregroundPresentationOptions?: {
        alert?: boolean;
        sound?: boolean;
        badge?: boolean;
        banner?: boolean;
        list?: boolean;
    };
    communicationInfo?: {
        conversationId: string;
        body?: string;
        sender: {
            id: string;
            displayName: string;
            avatar?: string;
        };
    };
};

export interface Notifee {
    id?: string;
    title?: string | undefined;
    subtitle?: string | undefined;
    body?: string | undefined;
    data?: {
        [key: string]: string | object | number;
    };
    android?: NotifeeAndroid;
    ios?: NotifeeIOS;

    readonly remote?: {
        messageId: string;
        senderId: string;
        mutableContent?: number;
        contentAvailable?: number;
    };
}

type NotificationData = {
    title: TemplateTitleType;
    body: string;
    link: string;
};

export interface FCMMessage
    extends Omit<admin.messaging.TokenMessage, 'data'>,
        Omit<admin.messaging.ConditionMessage, 'data'>,
        Omit<admin.messaging.TopicMessage, 'data'> {
    data: NotificationData;
}

export interface FCMMulticastMessage extends Omit<admin.messaging.MulticastMessage, 'data'> {
    data: NotificationData;
}

interface NotificationBase {
    userId: string;
    articleParams: {
        [key: string]: string;
    };
}

interface NotificationComment extends NotificationBase {
    type: TemplateType.Comment;
    postId: string;
    postThumbnail: string;
    userThumbnail: string;
}

interface NotificationFollow extends NotificationBase {
    type: TemplateType.Follow;
    userNickname: string;
    userThumbnail: string;
}

interface NotificationLike extends NotificationBase {
    type: TemplateType.Like;
    postId: string;
    userThumbnail: string;
    postThumbnail: string;
}

interface NotificationNotice extends NotificationBase {
    type: TemplateType.Notice;
}

interface NotificationTag extends NotificationBase {
    type: TemplateType.Tag;
    postId: string;
    postThumbnail: string;
    userThumbnail: string;
}

export type NotificationPushParams =
    | NotificationComment
    | NotificationFollow
    | NotificationLike
    | NotificationNotice
    | NotificationTag;

export type NotificationPushData = {
    title: TemplateTitleType;
    body: string;
    link?: string;
};
