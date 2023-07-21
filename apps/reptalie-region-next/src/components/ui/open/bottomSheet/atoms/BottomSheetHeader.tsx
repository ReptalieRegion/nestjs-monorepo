import { ForwardedRef, PropsWithChildren, forwardRef } from 'react';

const BottomSheetHeader = ({ children }: PropsWithChildren, ref: ForwardedRef<HTMLDivElement>) => {
    return (
        <div ref={ref}>
            <div className="flex justify-center pt-15pxr pb-15pxr">
                <div className="w-[30%] h-5pxr bg-gray-400 rounded-md" />
            </div>
            {children}
        </div>
    );
};

export default forwardRef(BottomSheetHeader);
