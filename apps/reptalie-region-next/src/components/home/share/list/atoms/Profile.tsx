'use client';
import { IPostsData } from '<API>';
import { RouterContext } from '@/contexts/router/RouterContext';
import { ScrollContext } from '@/contexts/scroll/ScrollContext';
import Image from 'next/image';
import { useContext } from 'react';

type TProfileProps = Pick<IPostsData, 'profile' | 'name' | 'userId'>;

export const Profile = ({ name, profile, userId }: TProfileProps) => {
    const router = useContext(RouterContext);
    const { scrollTop, uuid } = useContext(ScrollContext);

    return (
        <div
            onClick={() => router.push(`/home/share/${userId}`, { scrollInfo: { uuid, scrollTop }, query: { refetch: true } })}
            className="flex flex-row items-center space-x-5pxr"
        >
            <Image
                width={30}
                height={30}
                src={profile.src}
                alt={profile.alt}
                className="rounded-full w-30pxr h-30pxr object-cover"
                draggable={false}
            />
            <div>{name}</div>
        </div>
    );
};
