import { ReactNode } from 'react';
import Bottombar from '@/components/ContainerContent/Bottombar';

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            {children}
            <Bottombar />
        </>
    );
};

export default Layout;
