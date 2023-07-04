'use client';

import ScrollComponentContext from '@/contexts/scroll/ScrollContext';
import DetailProfile from '@/components/home/share/detail/templates/DetailProfile';

interface IShareDetailPageProps {
    params: {
        id: string;
    };
}

export default function ShareDetailPage({ params }: IShareDetailPageProps) {
    return (
        <ScrollComponentContext customStyle={{ padding: '10px 0' }} uuid="share">
            <DetailProfile id={params.id} />
        </ScrollComponentContext>
    );
}
