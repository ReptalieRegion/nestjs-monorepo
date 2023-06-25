'use client';

import PostWriteIcon from '@/assets/icons/post_write.svg';
import { Navigate } from '@/utils/webveiw-bridge/Navigate';

interface IPostWriteProps {
    className?: string;
}

const PostWrite = ({ className }: IPostWriteProps) => {
    const handleRouteImageCrop = () => {
        Navigate.push({ route: 'ImageCropPage' });
    };

    return (
        <div
            onClick={handleRouteImageCrop}
            className={`absolute bottom-0pxr w-50pxr h-50pxr bg-teal-150 rounded-full flex justify-center items-center active:scale-[0.85] transition-all ${className}`}
        >
            <PostWriteIcon />
        </div>
    );
};

export default PostWrite;
