import { IDetailPostsData } from '<API>';
import ActivitySummaryItem from '../atoms/ActivitySummaryItem';

const ActivitySummary = (props: IDetailPostsData) => {
    const { followerCount, followingCount, posts } = props;

    const handleClickFollower = () => {
        return;
    };

    const handleClickFollowing = () => {
        return;
    };

    return (
        <div className="flex flex-row w-full justify-center space-x-10pxr">
            <ActivitySummaryItem content="게시물" count={posts.length} />
            <ActivitySummaryItem content="팔로워" count={followerCount} onClick={handleClickFollower} />
            <ActivitySummaryItem content="팔로잉" count={followingCount} onClick={handleClickFollowing} />
        </div>
    );
};

export default ActivitySummary;
