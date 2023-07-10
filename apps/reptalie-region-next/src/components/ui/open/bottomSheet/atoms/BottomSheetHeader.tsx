import { ForwardedRef, forwardRef } from 'react';

const BottomSheetHeader = (_: unknown, ref: ForwardedRef<HTMLDivElement>) => {
    return (
        <div ref={ref} className="flex justify-center pt-15pxr pb-15pxr">
            <div className="w-[30%] h-5pxr bg-gray-400 rounded-md" />
        </div>
    );
};

export default forwardRef(BottomSheetHeader);
