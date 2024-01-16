import { Injectable } from '@nestjs/common';
import { ReportShareContentType } from '../../../dto/report/share/input-reportShareContent.dto';
import { ReportShareContentRepository } from '../repository/reportShareContent.repository';
import { ReportUserBlockingRepository } from '../repository/reportUserBlocking.repository';

export const ReportSearcherServiceToken = 'ReportSearcherServiceToken';

@Injectable()
export class ReportSearcherService {
    constructor(
        private readonly reportShareContentRepository: ReportShareContentRepository,
        private readonly reportUserBlockingRepository: ReportUserBlockingRepository,
    ) {}

    async getUserBlockingInfiniteScroll(blocker: string, pageParam: number, limitSize: number) {
        const blockings = await this.reportUserBlockingRepository
            .find({ blocker, isDeleted: false })
            .populate({
                path: 'blocked',
                select: 'nickname imageId',
                populate: { path: 'imageId', model: 'Image', select: 'imageKey -_id' },
            })
            .skip(pageParam * limitSize)
            .limit(limitSize)
            .exec();

        const items = blockings.map((entity) => {
            const blocking = entity.Mapper();
            const userInfo = Object(blocking.blocked).Mapper();

            return {
                blocking: {
                    id: blocking.id,
                    user: {
                        nickname: userInfo.nickname,
                        profile: {
                            src: `${process.env.AWS_IMAGE_BASEURL}${userInfo.imageId.imageKey}`,
                        },
                    },
                },
            };
        });

        const isLastPage = blockings.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }

    async findTypeIdList(reporter: string, type: ReportShareContentType): Promise<string[] | undefined> {
        if (!reporter) {
            return undefined;
        }

        const report = await this.reportShareContentRepository.find({ reporter, type }, { typeId: 1 }).exec();

        const typeIds = report.reduce<string[]>((accumulator, entity) => {
            const typeId = entity.Mapper().typeId;

            if (typeof typeId === 'string' && !accumulator.includes(typeId)) {
                accumulator.push(typeId);
            }
            return accumulator;
        }, []);

        return typeIds.length > 0 ? typeIds : undefined;
    }

    async reportShareContentCount(reported: string) {
        return this.reportShareContentRepository.countDocuments({ reported });
    }

    async getblockedList(blocker: string) {
        const blockings = await this.reportUserBlockingRepository.find({ blocker, isDeleted: false }).exec();
        return blockings.map((entitiy) => entitiy.Mapper().blocked as string);
    }
}
