import { IDetailPostsData } from '<API>';
import Image from 'next/image';

const UserAvatar = (props: IDetailPostsData) => {
    const { profile, nickname } = props;

    return (
        <>
            <div className="relative">
                <Image
                    width={100}
                    height={100}
                    src={profile.src}
                    alt={profile.alt ?? ''}
                    className="rounded-full w-80pxr h-80pxr object-cover"
                />
            </div>
            <div className="font-medium">{nickname}</div>
        </>
    );
};

export default UserAvatar;
