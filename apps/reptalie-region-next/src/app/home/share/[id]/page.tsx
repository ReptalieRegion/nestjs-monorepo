'use client';
import ScrollComponentContext from '@/contexts/scroll/ScrollContext';
import { useFetchDetailPosts } from '@/react-query/home/share/client/hooks';
import Image from 'next/image';

interface IShareDetailPageProps {
    params: {
        id: string;
    };
}
export default function ShareDetailPage({ params }: IShareDetailPageProps) {
    const { data, error, isLoading } = useFetchDetailPosts(params.id);

    if (isLoading) {
        return <div></div>;
    }

    return data !== undefined ? (
        <ScrollComponentContext>
            <div className="p-20pxr flex flex-col items-center space-y-5pxr">
                <div className="relative">
                    <Image
                        width={100}
                        height={100}
                        src={data.profile.src}
                        alt={data.profile.alt}
                        className="rounded-full w-80pxr h-80pxr object-cover"
                    />
                </div>
                <div className="font-medium">{data.nickname}</div>
                <div className="flex flex-row w-full justify-center space-x-10pxr">
                    <span className="flex flex-row items-center text-sm space-x-5pxr">
                        <div>게시물</div>
                        <div className="text-teal-150 font-semibold">{data.posts.length}</div>
                    </span>
                    <span className="flex flex-row items-center text-sm space-x-5pxr">
                        <div>팔로워</div>
                        <div className="text-teal-150 font-semibold">{data.followerCount}</div>
                    </span>
                    <span className="flex flex-row items-center text-sm space-x-5pxr">
                        <div>팔로잉</div>
                        <div className="text-teal-150 font-semibold">{data.followingCount}</div>
                    </span>
                </div>
            </div>

            <div className="flex flex-row justify-items-start items-start w-full flex-wrap">
                {data.posts.map(({ thumbnail }, index) => (
                    <div key={thumbnail.alt + index} className={`w-[33%] p-2pxr`}>
                        <Image
                            width={100}
                            height={100}
                            src={thumbnail.src}
                            alt={thumbnail.alt}
                            style={{ width: '100%', objectFit: 'cover', aspectRatio: '1/1' }}
                        />
                    </div>
                ))}
            </div>
        </ScrollComponentContext>
    ) : (
        <></>
    );
}
