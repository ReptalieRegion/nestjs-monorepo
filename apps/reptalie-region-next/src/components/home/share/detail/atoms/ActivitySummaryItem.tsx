interface IActivitySummaryItemProps {
    onClick?: () => void;
    content: string;
    count: number;
}

const ActivitySummaryItem = ({ onClick, content, count }: IActivitySummaryItemProps) => {
    return (
        <span onClick={onClick} className="flex flex-row items-center text-sm space-x-5pxr">
            <div>{content}</div>
            <div className="text-green-750 font-semibold">{count}</div>
        </span>
    );
};

export default ActivitySummaryItem;
