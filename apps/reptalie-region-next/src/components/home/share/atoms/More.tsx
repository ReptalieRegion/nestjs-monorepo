'use client';
import MoreIcon from '@/assets/icons/more.svg';

const openBottomSheet = () => {
    console.log('바텀시트');
};

const More = () => {
    return (
        <div onClick={openBottomSheet}>
            <MoreIcon />
        </div>
    );
};

export default More;
