import { SchemaId } from '../common/id';
import { UserActivityType } from '../enums/user';

interface IUserActivityLog {
    _id: SchemaId;
    id: string;
    userId: SchemaId;
    activityType: UserActivityType;
    details?: string;
    createdAt: Date;
}

export type { IUserActivityLog };
