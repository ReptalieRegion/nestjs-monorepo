'use client';

import Posts from '@/components/home/share/templates/Posts';
import ScrollComponentContext from '@/contexts/scroll/ScrollContext';

export default function SharePage() {
    return (
        <ScrollComponentContext>
            <Posts />
        </ScrollComponentContext>
    );
}
