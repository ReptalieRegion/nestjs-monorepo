type GenericObject = Record<string, unknown>;

export const doesPathExist = (object: GenericObject, path: string): boolean => {
    let currentPosition: unknown = object;
    const properties = path.split('.');

    for (const currentProperty of properties) {
        if (currentPosition === undefined || currentPosition === null) {
            return false;
        }
        currentPosition = (currentPosition as GenericObject)[currentProperty];
    }

    return currentPosition !== undefined && currentPosition !== null;
};

export const doPathsExist = (object: GenericObject, paths: string[]): boolean => {
    for (const path of paths) {
        if (!doesPathExist(object, path)) {
            return false;
        }
    }

    return true;
};
