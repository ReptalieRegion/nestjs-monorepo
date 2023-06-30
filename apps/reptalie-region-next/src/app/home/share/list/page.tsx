'use client';

import Posts from '@/components/home/share/list/templates/Posts';
import ScrollComponentContext from '@/contexts/scroll/ScrollContext';

export default function SharePage() {
    return (
        <ScrollComponentContext customStyle={{ padding: 20 }}>
            <Posts />
        </ScrollComponentContext>
    );
}
