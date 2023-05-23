import { ReactNode } from 'react';
import { ShareHeader } from '@/components/home/share';
import Bottombar from '@/components/ui/ContainerContent/Bottombar';

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="h-[100vh] flex flex-col">
            <ShareHeader />
            <section className="p-20pxr flex-1 overflow-y-scroll">{children}</section>
            <Bottombar />
        </div>
    );
};

export default Layout;
