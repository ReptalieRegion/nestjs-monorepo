'use client';

import Posts from '@/components/home/share/list/templates/Posts';
import ScrollComponentContext from '@/contexts/scroll/ScrollContext';
import { useEffect } from 'react';

export default function SharePage() {
    useEffect(() => () => console.log('hi'));

    return (
        <ScrollComponentContext customStyle={{ padding: 20 }}>
            <Posts />
        </ScrollComponentContext>
    );
}
