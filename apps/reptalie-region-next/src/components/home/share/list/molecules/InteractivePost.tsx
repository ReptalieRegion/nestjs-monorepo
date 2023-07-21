import { IPostsData } from '<API>';
import Like from '../atoms/Like';
import CommentIcon from '../atoms/CommentIcon';
import ImagesIndicators from '../atoms/ImagesIndicators';

type IInteractivePost = Pick<IPostsData, 'isLike' | 'postId' | 'images'>;

const InteractivePost = ({ postId, isLike, images }: IInteractivePost) => {
    return (
        <div className="flex flex-row justify-between mb-5pxr">
            <div className="flex flex-row ml-[-5px]">
                <Like postId={postId} isLike={isLike} />
                <CommentIcon postId={postId} />
            </div>
            <div className="flex flex-row items-center space-x-2pxr">
                <ImagesIndicators images={images} postId={postId} />
            </div>
            <div className="w-80pxr" />
        </div>
    );
};

export default InteractivePost;
