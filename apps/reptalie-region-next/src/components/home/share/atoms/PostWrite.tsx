'use client';

import PostWriteIcon from '@/assets/icons/post_write.svg';

const PostWrite = () => {
    return (
        <div className="fixed bottom-110pxr right-20pxr active:scale-[0.85] transition-all">
            <div className="w-50pxr h-50pxr bg-teal-150 rounded-full flex justify-center items-center">
                <PostWriteIcon />
            </div>
        </div>
    );
};

export default PostWrite;
