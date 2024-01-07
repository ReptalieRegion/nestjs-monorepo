import { Readable } from 'stream';
import { fakerKO } from '@faker-js/faker';
import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import axios from 'axios';
import mongoose from 'mongoose';
import { range } from '../../utils/array/range';
import { UnCatchException } from '../../utils/error/unCatchException';
import { disassembleHangulToGroups } from '../../utils/hangul/disassemble';
import { AuthCommonService, AuthCommonServiceToken } from '../auth/service/authCommon.service';
import { AuthSocialService, AuthSocialServiceToken } from '../auth/service/authSocial.service';
import { DiaryWriterService, DiaryWriterServiceToken } from '../diary/service/diaryWriter.service';
import { MetaDataSearcherService, MetaDataSearcherServiceToken } from '../metadata/service/metaDataSearcher.service';
import { NotificationAgreeService, NotificationAgreeServiceToken } from '../notification/service/notificationAgree.service';
import { NotificationSlackService, NotificationSlackServiceToken } from '../notification/service/notificationSlack.service';
import { ShareSearcherService, ShareSearcherServiceToken } from '../share/service/shareSearcher.service';
import { ShareWriterService, ShareWriterServiceToken } from '../share/service/shareWriter.service';
import { UserSearcherService, UserSearcherServiceToken } from '../user/service/userSearcher.service';
import { UserUpdaterService, UserUpdaterServiceToken } from '../user/service/userUpdater.service';
import { UserWriterService, UserWriterServiceToken } from '../user/service/userWriter.service';
import { GENDER_ARRAY, WEIGHT_UNIT_ARRAY } from './mock.constants';

export const MockServiceToken = 'MockServiceToken';

@Injectable()
export class MockService {
    constructor(
        @InjectConnection()
        private readonly connection: mongoose.Connection,

        @Inject(AuthSocialServiceToken)
        private readonly authSocialService: AuthSocialService,
        @Inject(AuthCommonServiceToken)
        private readonly authCommonService: AuthCommonService,
        @Inject(UserWriterServiceToken)
        private readonly userWriterService: UserWriterService,
        @Inject(UserUpdaterServiceToken)
        private readonly userUpdateService: UserUpdaterService,
        @Inject(UserSearcherServiceToken)
        private readonly userSearcherService: UserSearcherService,
        @Inject(ShareWriterServiceToken)
        private readonly shareWriterService: ShareWriterService,
        @Inject(ShareSearcherServiceToken)
        private readonly shareSearcherService: ShareSearcherService,
        @Inject(NotificationSlackServiceToken)
        private readonly slackService: NotificationSlackService,
        @Inject(NotificationAgreeServiceToken)
        private readonly notificationAgreeService: NotificationAgreeService,
        @Inject(DiaryWriterServiceToken)
        private readonly diaryWriterService: DiaryWriterService,
        @Inject(MetaDataSearcherServiceToken)
        private readonly metaDataSearcherService: MetaDataSearcherService,
    ) {}

    /**
     * 유저 생성
     */
    async createUser(nickname?: string) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const user = await this.authSocialService.mockSocialSignUp(session);
            if (!user.id) {
                throw new Error('userId 없음');
            }
            const result = await this.authCommonService.tokenGenerationAndStorage(user.id, session);
            const newNickname = nickname ?? user.nickname;
            if (newNickname) {
                const initials = disassembleHangulToGroups(newNickname)
                    .flatMap((value) => value[0])
                    .join('');
                await this.userUpdateService.updateNickname(newNickname, initials, user.id, session);
            }
            await session.commitTransaction();

            this.notificationAgreeService.createAgree(user.id);
            this.slackService.send('유저 생성 성공', 'mock-data');
            return result;
        } catch (error) {
            this.slackService.send('유저 생성 실패', 'mock-data');
            await session.abortTransaction();
        } finally {
            await session.endSession();
        }
    }

    /**
     * 여러 유저 생성
     */
    async createUsers(size: number) {
        Promise.allSettled(range(size).map(this.createUser)).then((results) => this.slackMessage(results, '유저생성', ''));
        return;
    }

    /**
     * 랜덤한 유저의 게시물 생성
     */
    async createPosts(size: number, nickname?: string) {
        if (nickname) {
            const targetUser = (await this.userSearcherService.findUserProfileByNickname(nickname))[0];
            const posts = range(size).map(async () => {
                const files = await Promise.all(
                    range(fakerKO.number.int({ min: 1, max: 5 })).map(this.downloadAndConvertToMulterFile),
                );
                return this.shareWriterService.createPostWithImages(
                    targetUser,
                    { contents: await this.createContents() },
                    files,
                );
            });

            Promise.allSettled(posts).then((results) => {
                this.slackMessage(results, '게시글 생성', nickname);
            });

            return;
        }

        const users = await this.userSearcherService.getRandomUserProfile(size);

        const posts = users.map(async (user) => {
            const files = await Promise.all(
                range(fakerKO.number.int({ min: 1, max: 5 })).map(this.downloadAndConvertToMulterFile),
            );
            return this.shareWriterService.createPostWithImages(user, { contents: await this.createContents() }, files);
        });

        Promise.allSettled(posts).then((results) => {
            this.slackMessage(results, '게시글 생성', '');
        });
    }

    async createPost(nickname: string) {
        try {
            const targetUser = (await this.userSearcherService.findUserProfileByNickname(nickname))[0];

            const files = await Promise.all(
                range(fakerKO.number.int({ min: 1, max: 5 })).map(this.downloadAndConvertToMulterFile),
            );

            const post = await this.shareWriterService.createPostWithImages(
                targetUser,
                { contents: await this.createContents() },
                files,
            );
            return post;
        } catch (error) {
            if (error instanceof Error) {
                return error.message;
            }

            throw new UnCatchException();
        }
    }

    /**
     * 랜덤한 게시물 또는 입력한 게물울에 여러 댓글 생성
     */
    async createComments(size: number, postId?: string) {
        const newPostId = postId ? postId : (await this.shareSearcherService.getRandomPosts())[0].id;
        const users = await this.userSearcherService.getRandomUserProfile(size);

        Promise.allSettled(
            users.map(async (user) =>
                this.shareWriterService.createComment(user, {
                    contents: await this.createContents(),
                    postId: newPostId,
                }),
            ),
        ).then((results) => {
            this.slackMessage(results, '댓글 생성', `\n${newPostId}`);
        });
    }

    /**
     * 랜덤한 댓글 또는 입력한 댓글에 대댓글 생성
     */
    async createCommentReplies(size: number, commentId?: string) {
        const users = await this.userSearcherService.getRandomUserProfile(size);
        const newCommentId = commentId ?? (await this.shareSearcherService.getRandomComments())[0].id;

        Promise.allSettled(
            users.map(async (user) => {
                return this.shareWriterService.createCommentReply(user, {
                    contents: await this.createContents(),
                    commentId: newCommentId,
                });
            }),
        ).then((results) => {
            this.slackMessage(results, '대댓글 생성', `${newCommentId}`);
        });
    }

    /**
     * 랜덤한 유저 또는 입력한 유저의 팔로워 생성
     */
    async createCommentFollow(size: number, followingNickname?: string) {
        const following = followingNickname
            ? (await this.userSearcherService.findUserProfileByNickname(followingNickname))[0]
            : (await this.userSearcherService.getRandomUserProfile(1))[0];
        const userIds = await this.userSearcherService.getNotFollowerUserIds(following.id, size);

        Promise.allSettled(userIds.map(({ id: userId }) => this.userWriterService.createFollow(following, userId))).then(
            (results) => this.slackMessage(results, '팔로워 생성', `\n${following.nickname}`),
        );

        return;
    }

    /**
     * 랜덤한 게시물 또는 입력한 게시물 좋아요 생성
     */
    async createPostLike(size: number, postId?: string) {
        const newPostId = postId ? postId : (await this.shareSearcherService.getRandomPosts())[0].id;
        const postLikeUserIds = await this.shareSearcherService.findPostLikeUserIdsById(newPostId);
        const users = await this.userSearcherService.getRandomExcludeUser(
            postLikeUserIds.map(({ id }) => id),
            size,
        );

        Promise.allSettled(users.map((user) => this.shareWriterService.createLike(user, newPostId))).then((results) =>
            this.slackMessage(results, '좋아요 생성', `\n${newPostId}`),
        );
    }

    async createDiaryEntity(size: number, nickname?: string) {
        const variety = await this.generatorVariety();
        if (variety) {
            const user = nickname
                ? (await this.userSearcherService.findUserProfileByNickname(nickname))[0]
                : (await this.userSearcherService.getRandomUserProfile())[0];

            Promise.allSettled(
                range(size).map(async () => {
                    return this.diaryWriterService.createEntity(user, [await this.downloadAndConvertToMulterFile()], {
                        gender: GENDER_ARRAY[fakerKO.number.int({ min: 0, max: GENDER_ARRAY.length - 1 })],
                        hatching: fakerKO.date.between({ from: '2016-01-01', to: new Date() }),
                        name: fakerKO.person.fullName(),
                        weightUnit: WEIGHT_UNIT_ARRAY[fakerKO.number.int({ min: 0, max: WEIGHT_UNIT_ARRAY.length - 1 })],
                        variety: variety,
                    });
                }),
            ).then((results) => this.slackMessage(results, '개체 생성', `\n${nickname}`));
        }
    }

    private async generatorVariety() {
        const varietyMap = await this.metaDataSearcherService.getVarietyMap();

        if (!varietyMap?.data) {
            return;
        }
        const classificationList = varietyMap.data.get('classificationList') as string[];
        const speciesList = varietyMap.data.get('speciesList') as { [key: string]: string[] };
        const detailedSpeciesList = varietyMap.data.get('detailedSpeciesList') as { [key: string]: string[] };
        const morphList = varietyMap.data.get('morphList') as { [key: string]: string[] };

        const classification = classificationList[fakerKO.number.int({ min: 0, max: classificationList.length - 1 })];
        const species =
            speciesList[classification][fakerKO.number.int({ min: 0, max: speciesList[classification].length - 1 })];
        const detailedSpecies =
            detailedSpeciesList[species][fakerKO.number.int({ min: 0, max: detailedSpeciesList[species].length - 1 })];
        const morph = morphList[detailedSpecies]
            ? morphList[detailedSpecies][fakerKO.number.int({ min: 0, max: morphList[detailedSpecies].length - 1 })]
            : '기타';

        return {
            classification,
            species,
            detailedSpecies,
            morph,
        };
    }

    /**
     * 랜덤 이미지 다운로드
     */
    private async downloadAndConvertToMulterFile(): Promise<Express.Multer.File> {
        const response = await axios.get(fakerKO.image.url(), { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');

        return {
            fieldname: 'file',
            originalname: fakerKO.system.commonFileName('jpg'),
            encoding: '7bit',
            mimetype: 'image/jpeg',
            destination: 'uploads/',
            filename: fakerKO.system.commonFileName('jpg'),
            path: 'uploads/',
            size: buffer.length,
            buffer: buffer,
            stream: Readable.from([buffer]),
        };
    }

    /**
     * 태그 있는 글 생성
     */
    private async createContents() {
        const tagIdsCount = fakerKO.number.int({ min: 0, max: 2 });
        const users = await this.userSearcherService.getRandomUser(tagIdsCount);
        const tags = users.map((user) => ({ id: user.id, nickname: user.nickname }));

        const contentCount = fakerKO.number.int({ min: 1, max: 6 });
        const contents = range(contentCount).map(() => fakerKO.lorem.sentence());

        tags.forEach((tag) => {
            const insertionPoint = fakerKO.number.int({ min: 0, max: contentCount });
            contents.splice(insertionPoint, 0, tag.nickname);
        });

        return contents.join(' ');
    }

    /**
     * mock data 생성 성공 실패 개수 슬랙에 기록
     */
    private slackMessage<T>(results: Array<PromiseSettledResult<T>>, title: string, contents?: string) {
        let successCount = 0;
        let failCount = 0;
        results.forEach((result) => {
            if (result.status === 'fulfilled') {
                successCount = successCount + 1;
            } else {
                failCount = failCount + 1;
            }
        });

        if (successCount > 0) {
            this.slackService.send(`*${title} 성공: ${successCount}개*\n${contents}`, 'mock-data');
        }

        if (failCount > 0) {
            this.slackService.send(`*${title} 실패: ${failCount}개*\n${contents}`, 'mock-data');
        }
    }
}
