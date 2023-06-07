import { IPostsData } from '<API>';
import Like from '../atoms/Like';
import Comment from '../atoms/Comment';
import sharePostsStore from '@/stores/share-post';

type IInteractivePost = Pick<IPostsData, 'isFollow' | 'postId' | 'images'>;

const InteractivePost = ({ postId, isFollow, images }: IInteractivePost) => {
    const { getCurrentImageIndex } = sharePostsStore();
    const currentImageIndex = getCurrentImageIndex(postId);

    return (
        <div className="flex flex-row justify-between mb-5pxr">
            <div className="flex flex-row ml-[-5px]">
                <Like postId={postId} isFollow={isFollow} />
                <Comment postId={postId} />
            </div>
            <div className="flex flex-row pt-5pxr">
                {images.map((_, index) => (
                    <div key={index} className={`${index === currentImageIndex ? 'text-blue-400' : 'text-gray-400'}`}>
                        ●
                    </div>
                ))}
            </div>
            <div className="w-80pxr" />
        </div>
    );
};

export default InteractivePost;
