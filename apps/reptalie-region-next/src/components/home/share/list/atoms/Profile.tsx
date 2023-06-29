import { IPostsData } from '<API>';
import Image from 'next/image';
import Link from 'next/link';

type TProfileProps = Pick<IPostsData, 'profile' | 'name' | 'userId'>;

export const Profile = ({ name, profile, userId }: TProfileProps) => {
    return (
        <Link href={`/home/share/${userId}`} className="flex flex-row items-center space-x-5pxr">
            <Image
                width={30}
                height={30}
                src={profile.src}
                alt={profile.alt}
                className="rounded-full w-30pxr h-30pxr object-cover"
                draggable={false}
            />
            <div>{name}</div>
        </Link>
    );
};
