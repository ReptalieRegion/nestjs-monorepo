import {
    Aggregate,
    AggregateOptions,
    AnyKeys,
    FilterQuery,
    HydratedDocument,
    Model,
    ObjectId,
    PipelineStage,
    ProjectionType,
    QueryOptions,
    QueryWithHelpers,
    SaveOptions,
    UpdateQuery,
    UpdateWithAggregationPipeline,
    UpdateWriteOpResult,
} from 'mongoose';

/**
 * @description mongoose에서 타입을 export 해주지 않아서 임시로 꺼내줌
 */
interface DeleteResult {
    acknowledged: boolean;
    deletedCount: number;
}

export abstract class BaseRepository<T> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    // create 관련
    create(docs: Array<T | AnyKeys<T>>, options?: SaveOptions): Promise<Array<HydratedDocument<T>>> {
        return this.model.create(docs, options);
    }

    // find 관련
    find<ResultDoc = HydratedDocument<T>>(
        filter: FilterQuery<T>,
        projection?: ProjectionType<T> | null | undefined,
        options?: QueryOptions<T> | null | undefined,
    ): QueryWithHelpers<ResultDoc[], ResultDoc> {
        return this.model.find(filter, projection, options);
    }

    findOne<ResultDoc = HydratedDocument<T>>(
        filter?: FilterQuery<T>,
        projection?: ProjectionType<T> | null,
        options?: QueryOptions<T> | null,
    ): QueryWithHelpers<ResultDoc | null, ResultDoc> {
        return this.model.findOne(filter, projection, options);
    }

    findById<ResultDoc = HydratedDocument<T>>(
        id: unknown,
        projection?: ProjectionType<T> | null,
        options?: QueryOptions<T> | null,
    ): QueryWithHelpers<ResultDoc | null, ResultDoc> {
        return this.model.findById(id, projection, options);
    }

    findByIdAndUpdate<ResultDoc = HydratedDocument<T>>(
        id?: ObjectId | unknown,
        update?: UpdateQuery<T>,
        options?: QueryOptions<T> | null,
    ): QueryWithHelpers<ResultDoc | null, ResultDoc> {
        return this.model.findByIdAndUpdate(id, update, options);
    }

    findByIdAndDelete<ResultDoc = HydratedDocument<T>>(
        id?: ObjectId | unknown,
        options?: QueryOptions<T> | null,
    ): QueryWithHelpers<ResultDoc | null, ResultDoc> {
        return this.model.findByIdAndDelete(id, options);
    }

    // update 관련
    updateMany<ResultDoc = HydratedDocument<T>>(
        filter?: FilterQuery<T>,
        update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
        options?: QueryOptions<T> | null,
    ): QueryWithHelpers<UpdateWriteOpResult, ResultDoc> {
        return this.model.updateMany(filter, update, options);
    }

    updateOne<ResultDoc = HydratedDocument<T>>(
        filter?: FilterQuery<T>,
        update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
        options?: QueryOptions<T> | null,
    ): QueryWithHelpers<UpdateWriteOpResult, ResultDoc> {
        return this.model.updateOne(filter, update, options);
    }

    // delete 관련
    deleteMany(filter?: FilterQuery<T>, options?: QueryOptions<T>): QueryWithHelpers<DeleteResult, HydratedDocument<T>> {
        return this.model.deleteMany(filter, options);
    }

    deleteOne(filter?: FilterQuery<T>, options?: QueryOptions<T>): QueryWithHelpers<DeleteResult, HydratedDocument<T>> {
        return this.model.deleteOne(filter, options);
    }

    // count 관련
    countDocuments(filter?: FilterQuery<T>, options?: QueryOptions<T>): QueryWithHelpers<number, HydratedDocument<T>> {
        return this.model.countDocuments(filter, options);
    }

    aggregate<R = unknown>(pipeline?: PipelineStage[], options?: AggregateOptions): Aggregate<R[]> {
        return this.model.aggregate(pipeline, options);
    }
}
