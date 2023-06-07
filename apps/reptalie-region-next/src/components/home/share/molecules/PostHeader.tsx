import { IPostsData } from '<API>';
import Follow from '../atoms/Follow';
import More from '../atoms/More';
import Image from 'next/image';

type TPostHeaderProps = Pick<IPostsData, 'name' | 'profile'>;

const PostHeader = ({ profile, name }: TPostHeaderProps) => {
    return (
        <div className="flex flex-row items-center justify-between mb-10pxr">
            <div className="flex flex-row items-center space-x-5pxr">
                <Image
                    width={30}
                    height={30}
                    src={profile.src}
                    alt={profile.alt}
                    className="rounded-full object-cover w-30pxr h-30pxr"
                />
                <div>{name}</div>
            </div>
            <div className="flex flex-row items-center">
                <Follow />
                <More />
            </div>
        </div>
    );
};

export default PostHeader;
