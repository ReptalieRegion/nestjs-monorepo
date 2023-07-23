import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
    return <div className="h-[100vh] flex flex-col">{children}</div>;
};

export default Layout;
