'use client';

import ImageSlider from '@/components/ui/Carousel/ImageSlider';
import PostHeader from '../../share/molecules/PostHeader';
import InteractivePost from '../../share/molecules/InteractivePost';
import PostContent from '../../share/molecules/PostContent';
import { IPostsData } from '<API>';

const PostCard = (props: IPostsData) => {
    return (
        <div className="mb-40pxr text-sm">
            <PostHeader profile={props.profile} name={props.name} />
            <ImageSlider postId={props.postId} images={props.images} />
            <InteractivePost postId={props.postId} isFollow={props.isFollow} images={props.images} />
            <PostContent likeCount={props.likeCount} commentCount={props.commentCount} content={props.content} />
        </div>
    );
};

export default PostCard;
