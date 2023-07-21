'use client';

import { IPostsData } from '<API>';
import Comment from '@/assets/icons/comment.svg';
import useUIPromptManager from '@/hooks/useUIPromptManager';
import PostCommentBottomSheet, { IPostCommentBottomSheetProps } from '../ui-prompts/bottomSheet/PostCommentBottomSheet';

type ICommentProps = Pick<IPostsData, 'postId'>;

const CommentIcon = ({ postId }: ICommentProps) => {
    const { openPrompt } = useUIPromptManager();

    const handleClickComment = () => {
        openPrompt<IPostCommentBottomSheetProps>({
            Component: PostCommentBottomSheet,
            promptType: 'bottomSheet',
            props: {},
        });
    };

    return (
        <div onClick={handleClickComment} className="w-40pxr h-40pxr stroke-black">
            <Comment />
        </div>
    );
};

export default CommentIcon;
