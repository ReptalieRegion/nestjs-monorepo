import LikeIcon from '@/assets/icons/like.svg';
import { AnimationEvent } from 'react';

interface IHeartAnimationProps {
    startLike: boolean;
    onAnimationEnd?: (event: AnimationEvent) => void;
}

const Dot = ({ className }: { className: string }) => {
    return <div className={className + ' absolute rounded-full w-10pxr h-10pxr bg-red-500'}></div>;
};

const HeartAnimation = ({ startLike, onAnimationEnd }: IHeartAnimationProps) => {
    if (!startLike) {
        return <></>;
    }

    return (
        <>
            <Dot className="left-[65%] translate-x-[-50%] top-[28%] animate-right-top" />
            <Dot className="left-[35%] translate-x-[-50%] top-[28%] animate-left-top" />
            <Dot className="left-[72%] translate-x-[-50%] top-[42%] animate-right" />
            <Dot className="left-[28%] translate-x-[-50%] top-[42%] animate-left" />
            <Dot className="left-[35%] translate-x-[-50%] top-[60%] animate-left-down" />
            <Dot className="left-[65%] translate-x-[-50%] top-[60%] animate-right-down" />
            <Dot className="left-[50%] translate-x-[-50%] top-[25%] animate-top" />
            <Dot className="left-[50%] translate-x-[-50%] top-[70%] animate-down" />
            <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                <div
                    className="scale-[3.5] fill-red-500 transform-gpu animate-scale-3-up-down"
                    onAnimationEnd={(event) => onAnimationEnd?.(event)}
                >
                    <LikeIcon />
                </div>
            </div>
        </>
    );
};

export default HeartAnimation;
