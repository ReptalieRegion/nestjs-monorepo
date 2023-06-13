import { ReactNode } from 'react';
import { ShareHeader } from '@/components/home/share';
import Bottombar from '@/components/ui/layouts/Bottombar';

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="h-[100vh] flex flex-col">
            <ShareHeader />
            {children}
            <Bottombar />
        </div>
    );
};

export default Layout;
