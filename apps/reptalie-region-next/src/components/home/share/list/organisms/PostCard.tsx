'use client';

import PostHeader from '../molecules/PostHeader';
import InteractivePost from '../molecules/InteractivePost';
import PostContent from '../molecules/PostContent';
import { IPostsData } from '<API>';
import PostImageCarousel from '../molecules/PostImageCarousel';

const PostCard = ({
    userId,
    isFollow,
    postId,
    profile,
    images,
    name,
    commentCount,
    likeCount,
    content,
    isLike,
}: IPostsData) => {
    return (
        <div className="mb-40pxr text-sm">
            <PostHeader userId={userId} isFollow={isFollow} profile={profile} name={name} />
            <PostImageCarousel postId={postId} images={images} />
            <InteractivePost postId={postId} isLike={isLike} images={images} />
            <PostContent likeCount={likeCount} commentCount={commentCount} content={content} />
        </div>
    );
};

export default PostCard;
