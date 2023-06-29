'use client';
import Header from '@/components/ui/layouts/Header';
import Search from '@/assets/icons/search.svg';
import { usePathname } from 'next/navigation';
import { IHeaderProps } from '<Header>';

const makeHeaderInfo = (currentPath: string): IHeaderProps => {
    if (currentPath.startsWith('/home/share')) {
        if (currentPath === '/home/share/list') {
            return { left: 'logo', center: undefined, right: <Search /> };
        }
        return { left: 'back', center: undefined, right: undefined };
    }

    return { left: undefined, center: undefined, right: undefined };
};

export const HomeHeader = () => {
    const pathname = usePathname();
    const { left, center, right } = makeHeaderInfo(pathname);

    return <Header left={left} center={center} right={right} />;
};
