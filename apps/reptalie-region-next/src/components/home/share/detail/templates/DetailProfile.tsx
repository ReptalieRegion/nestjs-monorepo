import ScrollComponentContext from '@/contexts/scroll/ScrollContext';
import { useFetchDetailPosts } from '@/react-query/home/share/client/hooks';
import UserDetailPanel from '../organisms/UserDetailPanel';
import PostsList from '../organisms/PostsList';

interface IDetailProfileProps {
    id: string;
}

const DetailProfile = ({ id }: IDetailProfileProps) => {
    const { data, isLoading } = useFetchDetailPosts(id);

    if (isLoading) {
        return <div />;
    }

    if (!data) {
        return <div />;
    }

    return (
        <>
            <UserDetailPanel {...data} />
            <PostsList {...data} />
        </>
    );
};

export default DetailProfile;
