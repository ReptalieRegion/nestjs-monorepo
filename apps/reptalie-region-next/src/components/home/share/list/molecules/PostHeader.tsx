import { IPostsData } from '<API>';
import Follow from '../atoms/Follow';
import PostKebabMenu from '../atoms/PostKebabMenu';
import { Profile } from '../atoms/Profile';

type TPostHeaderProps = Pick<IPostsData, 'name' | 'profile' | 'isFollow' | 'userId'>;

const PostHeader = ({ profile, name, isFollow, userId }: TPostHeaderProps) => {
    return (
        <div className="flex flex-row items-center justify-between mb-10pxr">
            <Profile userId={userId} name={name} profile={profile} />
            <div className="flex flex-row items-center">
                <Follow isFollow={isFollow} />
                <PostKebabMenu />
            </div>
        </div>
    );
};

export default PostHeader;
