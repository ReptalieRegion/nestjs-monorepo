import { Key, ReactNode } from 'react';

interface IFlexListListProps<AnyItem> {
    data: AnyItem[];
    gap?: number;
    colCount?: number;
    rowCount?: number;
    renderItem: ({ item, index }: { item: AnyItem; index: number }) => ReactNode;
    keyExtractor: ({ item, index }: { item: AnyItem; index: number }) => Key;
}

const FlexList = <AnyItem,>({
    data,
    gap = 2,
    colCount = 3,
    rowCount,
    renderItem,
    keyExtractor,
}: IFlexListListProps<AnyItem>) => {
    const maxLength = rowCount !== undefined ? colCount * rowCount : data.length;

    return (
        <div className="flex flex-row justify-items-start items-start w-full flex-wrap" style={{ gap }}>
            {data?.slice(0, maxLength).map((item, index) => {
                const RenderItem = renderItem({ item, index });
                const key = keyExtractor({ item, index });

                return (
                    <div key={key} style={{ width: `calc(100% / ${colCount} - ${((colCount - 1) * gap) / colCount}px` }}>
                        {RenderItem}
                    </div>
                );
            })}
        </div>
    );
};

export default FlexList;
