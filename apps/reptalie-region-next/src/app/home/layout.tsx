import { ReactNode } from 'react';
import { HomeBottomBar, HomeHeader } from '@/components/home/common/layouts';

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="h-[100vh] flex flex-col">
            <HomeHeader />
            {children}
        </div>
    );
};

export default Layout;
