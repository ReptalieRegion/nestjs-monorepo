import mongoose from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getViewFields = <TData>(context: any, fields: Array<keyof TData>): TData => {
    return fields.reduce<TData>((prev, field) => {
        const value = context.get(field);

        if (value === undefined) {
            return prev;
        }

        if (value instanceof mongoose.Types.ObjectId) {
            return {
                ...prev,
                [field]: value.toHexString(),
            };
        }

        return {
            ...prev,
            [field]: value,
        };
    }, {} as TData);
};
