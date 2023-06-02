import { ReactNode } from 'react';
import Logo from '@/assets/icons/logo.svg';

interface IHeaderProps {
    center?: ReactNode;
    right?: ReactNode;
}

const Header = ({ center, right }: IHeaderProps) => {
    return (
        <div className="left-0pxr top-0pxr w-full bg-white flex flex-row justify-between items-center pt-10pxr pb-10pxr pl-20pxr pr-20pxr border-b-[1px] shadow-md mt-40pxr">
            <div className="flex flex-col items-center justify-center">
                <Logo />
            </div>
            <div>{center}</div>
            <div className="w-32pxr">{right}</div>
        </div>
    );
};

export default Header;
