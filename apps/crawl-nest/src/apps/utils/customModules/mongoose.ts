import { MongooseModule } from '@nestjs/mongoose';
import {
    DiaryCalendar,
    DiaryCalendarSchema,
    DiaryEntity,
    DiaryEntitySchema,
    DiaryWeight,
    DiaryWeightSchema,
    Follow,
    FollowSchema,
    Image,
    ImageSchema,
    MetaData,
    MetaDataSchema,
    NotificationAgree,
    NotificationAgreeSchema,
    NotificationLog,
    NotificationLogSchema,
    NotificationTemplate,
    NotificationTemplateSchema,
    ReportShareContent,
    ReportShareContentSchema,
    ReportUserBlocking,
    ReportUserBlockingSchema,
    ShareComment,
    ShareCommentReply,
    ShareCommentReplySchema,
    ShareCommentSchema,
    ShareLike,
    ShareLikeSchema,
    SharePost,
    SharePostSchema,
    Social,
    TempUser,
    User,
    UserActivityLog,
    socialSchema,
    tempUserSchema,
    userActivityLogSchema,
    userSchema,
} from '@private-crawl/models';

export const CustomMongooseModule = MongooseModule.forRoot(process.env.MONGODB_URI ?? '', {
    dbName: 'crawl',
});

// user 관련 모듈
export const MongooseModuleUser = MongooseModule.forFeature([{ name: User.name, schema: userSchema }]);

export const MongooseModuleFollow = MongooseModule.forFeature([{ name: Follow.name, schema: FollowSchema }]);

export const MongooseModuleSocial = MongooseModule.forFeature([{ name: Social.name, schema: socialSchema }]);

export const MongooseModuleTempUser = MongooseModule.forFeature([{ name: TempUser.name, schema: tempUserSchema }]);

export const MongooseModuleUserActivityLog = MongooseModule.forFeature([
    { name: UserActivityLog.name, schema: userActivityLogSchema },
]);

// share 관련 모듈
export const MongooseModuleSharePost = MongooseModule.forFeature([{ name: SharePost.name, schema: SharePostSchema }]);

export const MongooseModuleShareComment = MongooseModule.forFeature([{ name: ShareComment.name, schema: ShareCommentSchema }]);

export const MongooseModuleShareCommentReply = MongooseModule.forFeature([
    { name: ShareCommentReply.name, schema: ShareCommentReplySchema },
]);

export const MongooseModuleShareLike = MongooseModule.forFeature([{ name: ShareLike.name, schema: ShareLikeSchema }]);

// image 관련 모듈
export const MongooseModuleImage = MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]);

// notification 관련 모듈
export const MongooseModuleNotificationTemplate = MongooseModule.forFeature([
    { name: NotificationTemplate.name, schema: NotificationTemplateSchema },
]);

export const MongooseModuleNotificationLog = MongooseModule.forFeature([
    { name: NotificationLog.name, schema: NotificationLogSchema },
]);

export const MongooseModuleNotificationAgree = MongooseModule.forFeature([
    { name: NotificationAgree.name, schema: NotificationAgreeSchema },
]);

// diary 관련 모듈
export const MongooseModuleDiaryEntity = MongooseModule.forFeature([{ name: DiaryEntity.name, schema: DiaryEntitySchema }]);

export const MongooseModuleDiaryWeight = MongooseModule.forFeature([{ name: DiaryWeight.name, schema: DiaryWeightSchema }]);

export const MongooseModuleDiaryCalendar = MongooseModule.forFeature([
    { name: DiaryCalendar.name, schema: DiaryCalendarSchema },
]);

// report 관련 모듈
export const MongooseModuleReportShareContent = MongooseModule.forFeature([
    { name: ReportShareContent.name, schema: ReportShareContentSchema },
]);

export const MongooseModuleReportUserBlocking = MongooseModule.forFeature([
    { name: ReportUserBlocking.name, schema: ReportUserBlockingSchema },
]);

// metadata 관련 모듈
export const MongooseModuleMetaData = MongooseModule.forFeature([{ name: MetaData.name, schema: MetaDataSchema }]);
