'use client';

import PostWriteIcon from '@/assets/icons/post_write.svg';
import { useRouter } from 'next/navigation';

interface IPostWriteProps {
    className?: string;
}

const PostWrite = ({ className }: IPostWriteProps) => {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push('share/write')}
            className={`absolute bottom-0pxr w-50pxr h-50pxr bg-teal-150 rounded-full flex justify-center items-center active:scale-[0.85] transition-all ${className}`}
        >
            <PostWriteIcon />
        </div>
    );
};

export default PostWrite;
