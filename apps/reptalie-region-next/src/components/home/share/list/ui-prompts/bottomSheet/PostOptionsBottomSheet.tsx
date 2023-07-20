import BackDrop from '@/components/ui/open/BackDrop';
import { BottomSheetContainer, BottomSheetHeader } from '@/components/ui/open/bottomSheet/atoms';
import useBottomSheetDrag from '@/hooks/useBottomSheetDrag';
import { IPrompts } from '<UIPrompts>';

export interface IPostOptionsBottomSheetProps {}

const MIN_HEIGHT = 0;
const HEIGHT = 100;
const MAX_HEIGHT = 500;

const PostOptionsBottomSheet = ({ closePrompt }: IPostOptionsBottomSheetProps & IPrompts) => {
    const { bottomSheetDragAreaRef, changeHeight, isTouchEnd } = useBottomSheetDrag({
        minHeight: MIN_HEIGHT,
        maxHeight: MAX_HEIGHT,
        height: HEIGHT,
    });

    return (
        <BackDrop close={closePrompt}>
            <BottomSheetContainer height={changeHeight} enableHeightTransition={isTouchEnd}>
                <BottomSheetHeader ref={bottomSheetDragAreaRef} />
                신고하기
            </BottomSheetContainer>
        </BackDrop>
    );
};

export default PostOptionsBottomSheet;
