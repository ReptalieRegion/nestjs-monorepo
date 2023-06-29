'use client';
import Header from '@/components/ui/layouts/Header';
import Search from '@/assets/icons/search.svg';
import { usePathname } from 'next/navigation';

const makeHeaderInfo = (currentPath: string) => {
    if (currentPath.startsWith('/home/share')) {
        return { center: undefined, right: <Search /> };
    }
};

export const HomeHeader = () => {
    const pathname = usePathname();
    const headerInfo = makeHeaderInfo(pathname);

    return <Header center={headerInfo?.center} right={headerInfo?.right} />;
};
