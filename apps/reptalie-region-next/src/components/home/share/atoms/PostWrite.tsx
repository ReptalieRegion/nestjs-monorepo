'use client';

import PostWriteIcon from '@/assets/icons/post_write.svg';

interface IPostWriteProps {
    className?: string;
}

const PostWrite = ({ className }: IPostWriteProps) => {
    return (
        <div
            className={`absolute bottom-0pxr w-50pxr h-50pxr bg-teal-150 rounded-full flex justify-center items-center active:scale-[0.85] transition-all ${className}`}
        >
            <PostWriteIcon />
        </div>
    );
};

export default PostWrite;
