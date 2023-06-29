import Image from 'next/image';

interface IProfileProps {
    imageInfo: {
        src: string;
        alt: string;
    };
    name: string;
}

export const Profile = ({ imageInfo, name }: IProfileProps) => {
    return (
        <div className="flex flex-row items-center space-x-5pxr">
            <Image
                width={30}
                height={30}
                src={imageInfo.src}
                alt={imageInfo.alt}
                className="rounded-full w-30pxr h-30pxr"
                draggable={false}
            />
            <div>{name}</div>
        </div>
    );
};
