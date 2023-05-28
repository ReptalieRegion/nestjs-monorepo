'use client';
import Image from 'next/image';
import More from '@/assets/icons/more.svg';
import test from '@/assets/images/contemplative-reptile.jpg';
import Like from '@/assets/icons/like.svg';
import Comment from '@/assets/icons/comment.svg';
import ImageSlider from '@/components/ui/Carousel/ImageSlider';

const ShareCard = () => {
    return (
        <div className="mb-40pxr text-sm">
            <div className="flex flex-row items-center justify-between mb-10pxr">
                <div className="flex flex-row items-center space-x-5pxr">
                    <Image src={test} alt="이미지" className="rounded-full w-30pxr h-30pxr" />
                    <div>홍길동</div>
                </div>
                <div className="flex flex-row items-center">
                    <div className="text-teal-150">팔로우</div>
                    <More />
                </div>
            </div>
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
