import Follow from '../atoms/Follow';
import More from '../atoms/More';
import { Profile } from '../atoms/Profile';

interface IProfileProps {
    imageInfo: {
        src: string;
        alt: string;
    };
    name: string;
}

export const ShareCardHeader = ({ imageInfo, name }: IProfileProps) => {
    return (
        <div className="flex flex-row items-center justify-between mb-10pxr">
            <Profile imageInfo={imageInfo} name={name} />
            <div className="flex flex-row items-center">
                <Follow />
                <More />
            </div>
        </div>
    );
};
