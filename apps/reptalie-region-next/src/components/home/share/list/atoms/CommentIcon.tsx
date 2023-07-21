'use client';

import { IPostsData } from '<API>';
import Comment from '@/assets/icons/comment.svg';
import { RouterContext } from '@/contexts/router/RouterContext';
import { useContext } from 'react';

type ICommentProps = Pick<IPostsData, 'postId'>;

const CommentIcon = ({ postId }: ICommentProps) => {
    const route = useContext(RouterContext);
    const handleClickComment = () => {
        route.push(`/home/share/comment/${postId}`);
    };

    return (
        <div onClick={handleClickComment} className="w-40pxr h-40pxr stroke-black">
            <Comment />
        </div>
    );
};

export default CommentIcon;
