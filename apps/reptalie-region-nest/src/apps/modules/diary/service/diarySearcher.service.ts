import { Injectable } from '@nestjs/common';
import { startAndEndDate } from '../../../utils/time/time';
import { DiaryCalendarRepository } from '../repository/diaryCalendar.repository';
import { DiaryEntityRepository } from '../repository/diaryEntity.repository';
import { DiaryWeightRepository } from '../repository/diaryWeight.repository';

export const DiarySearcherServiceToken = 'DiarySearcherServiceToken';

@Injectable()
export class DiarySearcherService {
    constructor(
        private readonly diaryEntityRepository: DiaryEntityRepository,
        private readonly diaryWeightRepository: DiaryWeightRepository,
        private readonly diaryCalendarRepository: DiaryCalendarRepository,
    ) {}

    /**
     * 개체에 대한 정보를 무한 스크롤로 가져옵니다.
     *
     * @param userId - 현재 사용자의 ID입니다.
     * @param pageParam - 현재 페이지 번호입니다.
     * @param limitSize - 한 페이지당 가져올 좋아요 수입니다.
     * @returns 가져온 개체 정보와 다음 페이지 번호를 반환합니다.
     */
    async getEntityInfiniteScroll(userId: string, pageParam: number, limitSize: number) {
        const entities = await this.diaryEntityRepository
            .find({ userId, isDeleted: false })
            .populate({ path: 'imageId', select: 'imageKey -_id' })
            .sort({ createdAt: -1 })
            .skip(pageParam * limitSize)
            .limit(limitSize)
            .exec();

        const items = entities.map((entity) => {
            const diary = entity.Mapper();

            return {
                entity: {
                    id: diary.id,
                    name: diary.name,
                    gender: diary.gender,
                    variety: {
                        ...diary.variety,
                        morph: typeof diary.variety?.morph === 'string' ? [diary.variety?.morph] : diary.variety?.morph,
                    },
                    hatching: diary.hatching,
                    weightUnit: diary.weightUnit,
                    image: { src: `${process.env.AWS_IMAGE_BASEURL}${Object(diary.imageId).imageKey}` },
                },
            };
        });

        const isLastPage = entities.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }

    async getWeightInfiniteScroll(entityId: string, pageParam: number, limitSize: number) {
        const weights = await this.diaryWeightRepository
            .find({ entityId, isDeleted: false })
            .sort({ date: -1 })
            .skip(pageParam * limitSize)
            .limit(limitSize)
            .exec();

        const items = weights.map((entity) => {
            const weight = entity.Mapper();

            return {
                date: weight.date,
                weight: weight.weight,
            };
        });

        const isLastPage = weights.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }

    async getCalendarInfiniteScroll(userId: string, date: Date, pageParam: number, limitSize: number) {
        const { startDate, endDate } = startAndEndDate(date);

        const calendars = await this.diaryCalendarRepository
            .find({ userId, isDeleted: false, date: { $gte: startDate, $lt: endDate } })
            .populate({
                path: 'entityId',
                select: 'name imageId',
                populate: { path: 'imageId', model: 'Image', select: 'imageKey -_id' },
            })
            .sort({ date: -1 })
            .skip(pageParam * limitSize)
            .limit(limitSize)
            .exec();

        const items = calendars.map((entity) => {
            const calendar = entity.Mapper();
            const entityInfo = Object(calendar.entityId).Mapper();

            return {
                id: calendar.id,
                entityId: entityInfo.id,
                name: entityInfo.name,
                memo: calendar.memo,
                markType: calendar.markType,
                date: calendar.date,
                image: { src: `${process.env.AWS_IMAGE_BASEURL}${entityInfo.imageId.imageKey}` },
            };
        });

        const isLastPage = calendars.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }
}
