'use client';

import MoreIcon from '@/assets/icons/more.svg';
import PostOptionsBottomSheet from '@/components/home/share/open/bottomSheet/PostOptionsBottomSheet';
import openStore, { TOpenType } from '@/stores/open';

const PostKebabMenu = () => {
    const { open } = openStore();

    const handleOpenBottomSheet = () => {
        const type: TOpenType = 'bottomSheet';
        open({ type, children: <PostOptionsBottomSheet type={type} /> });
    };

    return (
        <div onClick={handleOpenBottomSheet}>
            <MoreIcon />
        </div>
    );
};

export default PostKebabMenu;
