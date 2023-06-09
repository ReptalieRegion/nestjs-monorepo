import { ForwardedRef, forwardRef } from 'react';
import Image from 'next/image';
import { TImage } from '<API>';

interface IImagesContentProps {
    images: TImage[];
}

const ImagesContent = ({ images }: IImagesContentProps, ref: ForwardedRef<HTMLDivElement>) => {
    return (
        <div className="relative flex flex-row justify-center mb-5pxr">
            <div ref={ref} className="h-[250px] overflow-y-hidden overflow-x-hidden rounded-md scrollbar-hide">
                <div style={{ width: `calc(${images.length * 100}vw - ${images.length * 40}px)` }}>
                    {images.map(({ src, alt }, index) => {
                        return (
                            <div key={src + index.toString()} className="float-left w-[calc(100vw-40px)]">
                                <Image
                                    priority={index === 0}
                                    src={src}
                                    alt={alt}
                                    width={360}
                                    height={250}
                                    loading={index !== 0 ? 'lazy' : undefined}
                                    style={{
                                        objectFit: 'cover',
                                        width: '100%',
                                        minHeight: '250px',
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default forwardRef(ImagesContent);
