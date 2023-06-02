import ShareConent from '@/components/home/share/organisms/ShareConent';
import getQueryClient from '@/contexts/react-query/getQueryClient';
import { getPosts } from '@/fetch/share/posts';
import { Hydrate, dehydrate } from '@tanstack/react-query';

export default async function SharePage() {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(['posts'], getPosts);
    const dehydratedState = dehydrate(queryClient);

    return (
        <Hydrate state={dehydratedState}>
            <ShareConent />
        </Hydrate>
    );
}
