'use client';

import PostHeader from '../../share/molecules/PostHeader';
import InteractivePost from '../../share/molecules/InteractivePost';
import PostContent from '../../share/molecules/PostContent';
import { IPostsData } from '<API>';
import PostImageCarousel from '../molecules/PostImageCarousel';

const PostCard = ({ isFollow, postId, profile, images, name, commentCount, likeCount, content }: IPostsData) => {
    return (
        <div className="mb-40pxr text-sm">
            <PostHeader isFollow={isFollow} profile={profile} name={name} />
            <PostImageCarousel postId={postId} images={images} />
            <InteractivePost postId={postId} isFollow={isFollow} images={images} />
            <PostContent likeCount={likeCount} commentCount={commentCount} content={content} />
        </div>
    );
};

export default PostCard;
