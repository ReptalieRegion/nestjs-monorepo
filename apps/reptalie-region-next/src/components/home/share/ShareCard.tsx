'use client';
import Image from 'next/image';
import More from '@/assets/icons/more.svg';
import test from '@/assets/images/contemplative-reptile.jpg';
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
                    <div style={{ color: '#1E8B68' }}>팔로우</div>
                    <More />
                </div>
            </div>
            <ImageSlider />
            <div>게시물 테스트...</div>
        </div>
    );
};

export default ShareCard;
