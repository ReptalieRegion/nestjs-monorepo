'use client';

import { IPostsData } from '<API>';
import CommentIcon from '@/assets/icons/comment.svg';

type ICommentProps = Pick<IPostsData, 'postId'>;

const Comment = ({ postId }: ICommentProps) => {
    const handleClickComment = () => {
        console.log('댓글 보기', postId);
    };

    return (
        <div onClick={handleClickComment} className="w-40pxr h-40pxr stroke-black">
            <CommentIcon />
        </div>
    );
};

export default Comment;
