'use client';
import { IPostsData } from '<API>';
import sharePostsStore from '@/stores/share-post';

type TImagesIndicators = Pick<IPostsData, 'images' | 'postId'>;

const ImagesIndicators = ({ images, postId }: TImagesIndicators) => {
    const imageIndex = sharePostsStore((state) => state.postsOfInfo[postId]?.imageIndex);

    return (
        <div className="flex flex-row items-center space-x-2pxr">
            {images.map((_, index) => (
                <div key={index} className={`${index === imageIndex ? 'text-teal-150 scale-110' : 'text-gray-400'}`}>
                    ●
                </div>
            ))}
        </div>
    );
};

export default ImagesIndicators;
