import { IPostsData } from '<API>';

type ILikeCount = Pick<IPostsData, 'likeCount'>;

const LikeCount = ({ likeCount }: ILikeCount) => {
    return <div className="font-bold mb-2pxr">{likeCount}명이 좋아합니다.</div>;
};

export default LikeCount;
