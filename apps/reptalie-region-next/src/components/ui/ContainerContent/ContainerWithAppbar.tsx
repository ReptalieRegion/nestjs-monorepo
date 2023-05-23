import { ReactNode } from 'react';
import Appbar, { IAppbar } from './Appbar';

interface IContainerWithAppbarProps extends IAppbar {
    children: ReactNode;
}

const ContainerWithAppbar = ({ title, children }: IContainerWithAppbarProps) => {
    return (
        <div className="h-full">
            <Appbar title={title} />
            <div className="p-20pxr flex flex-col">{children}</div>
        </div>
    );
};

export default ContainerWithAppbar;
