import getQueryClient from '@/contexts/react-query/getQueryClient';

async function test() {
    const res = await fetch('http://localhost:3333/api/users/nickname-exists?nickname=윤댕');
    return res.json();
}
const Share = async () => {
    const queryClient = getQueryClient();
    await queryClient.prefetchInfiniteQuery(['h'], test);
    return <div>share</div>;
};

export default Share;
