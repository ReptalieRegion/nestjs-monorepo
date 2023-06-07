'use client';
import { useFetchPosts } from '@/react-query/home/share/client/hooks';
import ShareCard from './ShareCard';

const ShareContent = () => {
    const { data, isLoading } = useFetchPosts();

    if (isLoading) {
        return <div>로딩...</div>;
    }

    console.log(data);

    return (
        <div>
            <ShareCard />
            <ShareCard />
            <ShareCard />
            <ShareCard />
            <ShareCard />
        </div>
    );
};

export default ShareContent;
