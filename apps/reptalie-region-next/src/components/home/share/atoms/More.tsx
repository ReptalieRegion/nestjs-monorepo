'use client';
import MoreIcon from '@/assets/icons/more.svg';
import MoreBottomSheet from '@/components/home/share/bottomSheet/MoreBottomSheet';
import openStore, { TOpenType } from '@/stores/open';

const More = () => {
    const { open } = openStore();

    const handleOpenBottomSheet = () => {
        const type: TOpenType = 'bottomSheet';
        open({ type, children: <MoreBottomSheet type={type} /> });
    };

    return (
        <div onClick={handleOpenBottomSheet}>
            <MoreIcon />
        </div>
    );
};

export default More;
