import { useFetchDetailPosts } from '@/react-query/home/share/client/hooks';
import UserDetailPanel from '../organisms/UserDetailPanel';
import PostsList from '../organisms/PostsList';

interface IDetailProfileProps {
    id: string;
}

const DetailProfile = ({ id }: IDetailProfileProps) => {
    const { data, isLoading } = useFetchDetailPosts(id);

    if (isLoading || !data) {
        return (
            <div>
                <div>loading</div>
            </div>
        );
    }

    return (
        <>
            <UserDetailPanel {...data} />
            <PostsList {...data} />
        </>
    );
};

export default DetailProfile;
