import { Readable } from 'stream';
import { fakerKO } from '@faker-js/faker';
import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import axios from 'axios';
import mongoose from 'mongoose';
import { range } from '../../utils/array/range';
import { disassembleHangulToGroups } from '../../utils/hangul/disassemble';
import { AuthCommonService, AuthCommonServiceToken } from '../auth/service/authCommon.service';
import { AuthSocialService, AuthSocialServiceToken } from '../auth/service/authSocial.service';
import { NotificationSlackService, NotificationSlackServiceToken } from '../notification/service/notificationSlack.service';
import { ShareSearcherService, ShareSearcherServiceToken } from '../share/service/shareSearcher.service';
import { ShareWriterService, ShareWriterServiceToken } from '../share/service/shareWriter.service';
import { UserSearcherService, UserSearcherServiceToken } from '../user/service/userSearcher.service';
import { UserUpdaterService, UserUpdaterServiceToken } from '../user/service/userUpdater.service';
import { UserWriterService, UserWriterServiceToken } from '../user/service/userWriter.service';

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
            return result;
        } catch (error) {
            await session.abortTransaction();
            throw new Error('user 생성 실패');
        } finally {
            await session.endSession();
        }
    }

    /**
     * 랜덤한 유저의 게시물 생성
     */
    async createPosts(size: number) {
        const users = await this.userSearcherService.getRandomUserProfile(size);

        const posts = users.map(async (user) => {
            const files = await Promise.all(
                range(fakerKO.number.int({ min: 1, max: 5 })).map(this.downloadAndConvertToMulterFile),
            );
            return this.shareWriterService.createPostWithImages(user, { contents: await this.createContents() }, files);
        });

        Promise.allSettled(posts).then((results) => {
            this.slackMessage(results, '게시글 생성');
        });
    }

    /**
     * 랜덤한 유저가 여러 댓글 생성
     */
    async createComments(size: number) {
        const users = await this.userSearcherService.getRandomUserProfile();

        users.forEach(async (user) => {
            const posts = await this.shareSearcherService.getRandomPosts(size);

            Promise.allSettled(
                posts.map(async (post) =>
                    this.shareWriterService.createComment(user, {
                        contents: await this.createContents(),
                        postId: post.id,
                    }),
                ),
            ).then((results) => {
                this.slackMessage(results, '댓글 생성');
            });
        });
    }

    /**
     * 랜덤한 대댓글 생성
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
            this.slackMessage(
                results,
                '대댓글 생성',
                // results
                //     .reduce((prev, result) => {
                //         return result.status !== 'fulfilled' ? prev : [...prev, result.value.post.comment.id ?? ''];
                //     }, [] as string[])
                //     .join('\n'),
            );
        });
    }

    /**
     * 랜덤한 팔로우 생성
     */
    async createCommentFollow(size: number, followingNickname?: string) {
        const following = followingNickname
            ? (await this.userSearcherService.findUserProfileByNickname(followingNickname))[0]
            : (await this.userSearcherService.getRandomUserProfile(1))[0];
        const userIds = await this.userSearcherService.getNotFollowerUserIds(following.id, size);

        Promise.allSettled(userIds.map(({ id: userId }) => this.userWriterService.createFollow(following, userId))).then(
            (results) =>
                this.slackMessage(
                    results,
                    '팔로워 생성',
                    // results
                    //     .reduce((prev, result) => {
                    //         return result.status !== 'fulfilled' ? prev : [...prev, result.value?.user.nickname ?? ''];
                    //     }, [] as string[])
                    //     .join('\n'),
                ),
        );

        return;
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

    /** 태그 있는 글 생성 */
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
