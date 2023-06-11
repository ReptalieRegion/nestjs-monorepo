import openStore, { TOpenType } from '@/stores/open';
import BackDrop from '@/components/ui/open/BackDrop';
import { BottomSheetContainer, BottomSheetHeader } from '@/components/ui/open/bottomSheet/atoms';
import useBottomSheetDrag from '@/hooks/useBottomSheetDrag';

interface IBottomSheetProps {
    type: TOpenType;
}

const MIN_HEIGHT = 100;
const MAX_HEIGHT = 500;

const MoreBottomSheet = ({ type }: IBottomSheetProps) => {
    const { bottomSheetDragAreaRef, changeHeight, isTouchEnd } = useBottomSheetDrag({
        minHeight: MIN_HEIGHT,
        maxHeight: MAX_HEIGHT,
    });
    const { close } = openStore();
    const handleClickClose = () => {
        close(type);
    };

    return (
        <BackDrop close={handleClickClose}>
            <BottomSheetContainer height={changeHeight} enableHeightTransition={isTouchEnd}>
                <BottomSheetHeader ref={bottomSheetDragAreaRef} />
                신고하기
            </BottomSheetContainer>
        </BackDrop>
    );
};

export default MoreBottomSheet;
