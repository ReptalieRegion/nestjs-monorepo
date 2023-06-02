'use client';
import Like from '@/assets/icons/like.svg';
import Comment from '@/assets/icons/comment.svg';
import ImageSlider from '@/components/ui/Carousel/ImageSlider';
import { ShareCardHeader } from './molecules/ShareCardHeader';

const ShareCard = () => {
    return (
        <div className="mb-40pxr text-sm">
            <ShareCardHeader
                imageInfo={{ src: 'http://localhost:3000/contemplative-reptile.jpg', alt: '이미지' }}
                name="홍길동"
            />
            <ImageSlider />
            <div className="mb-10pxr">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row ml-[-5px]">
                        <div className="w-40pxr h-40pxr stroke-black">
                            <Like />
                        </div>
                        <div className="w-40pxr h-40pxr stroke-black">
                            <Comment />
                        </div>
                    </div>
                    <div>
                        <div className="text-blue-400">●●●●</div>
                    </div>
                    <div className="w-80pxr" />
                </div>
                <div className="font-bold">100명이 좋아합니다.</div>
            </div>
            <div>
                게시물 테스트하는
                중입니다.ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ
            </div>
        </div>
    );
};

export default ShareCard;
