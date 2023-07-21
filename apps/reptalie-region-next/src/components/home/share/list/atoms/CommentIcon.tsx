'use client';

import { IPostsData } from '<API>';
import Comment from '@/assets/icons/comment.svg';

type ICommentProps = Pick<IPostsData, 'postId'>;

const CommentIcon = ({ postId }: ICommentProps) => {
    const handleClickComment = () => {
        console.log(postId);
    };

    return (
        <div onClick={handleClickComment} className="w-40pxr h-40pxr stroke-black">
            <Comment />
        </div>
    );
};

export default CommentIcon;
