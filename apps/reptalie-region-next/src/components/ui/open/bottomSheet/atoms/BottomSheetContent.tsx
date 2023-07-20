import { PropsWithChildren } from 'react';

const BottomSheetContent = ({ children }: PropsWithChildren) => {
    return <div className="pl-20pxr pr-20pxr pb-15pxr h-full">{children}</div>;
};

export default BottomSheetContent;
