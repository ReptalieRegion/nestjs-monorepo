'use client';

import { IPostsData } from '<API>';
import { useEffect, useRef, useState } from 'react';

type ILikeCount = Pick<IPostsData, 'likeCount' | 'commentCount' | 'content'>;

const PostContent = ({ likeCount, commentCount, content }: ILikeCount) => {
    const [showMoreButton, setShowMoreButton] = useState<boolean>(false);
    const [openContent, setOpenContent] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const contentElement = contentRef.current;
        if (!contentElement) {
            return;
        }

        const isOverflow = contentElement.scrollHeight > contentElement.clientHeight;
        if (isOverflow) {
            setShowMoreButton(true);
        }
    }, []);

    return (
        <div>
            <div className="font-bold mb-5pxr">{likeCount}명이 좋아합니다.</div>
            <div className="mb-5pxr">
                <div ref={contentRef} className={`overflow-y-hidden overflow-x-hidden ${!openContent && 'max-h-[2.5rem]'} `}>
                    {content}
                </div>
                <span onClick={() => setOpenContent((state) => !state)} className="text-gray-500">
                    {showMoreButton ? (openContent ? '...접기' : '...더 보기') : ''}
                </span>
            </div>
            {commentCount !== 0 && <div className="text-gray-500">댓글 {commentCount}개 모두 보기</div>}
        </div>
    );
};

export default PostContent;
