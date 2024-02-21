export const parsePaginationParams = (pageParam: string, limitSize: string) => {
    const pageNumber = parseInt(pageParam, 10);
    const pageSize = parseInt(limitSize, 10);

    if (isNaN(pageNumber) || isNaN(pageSize)) {
        throw new Error('Invalid page number or page size.');
    }

    return { pageNumber, pageSize };
};
