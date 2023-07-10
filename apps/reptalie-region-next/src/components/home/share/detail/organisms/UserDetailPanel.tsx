import { IDetailPostsData } from '<API>';
import Follow from '../../list/atoms/Follow';
import UserAvatar from '../molecules/UserAvatar';
import ActivitySummary from '../molecules/ActivitySummary';

const UserDetailPanel = (data: IDetailPostsData) => {
    return (
        <div className="p-20pxr flex flex-col items-center space-y-5pxr">
            <UserAvatar {...data} />
            <ActivitySummary {...data} />
            <Follow isFollow />
        </div>
    );
};

export default UserDetailPanel;
