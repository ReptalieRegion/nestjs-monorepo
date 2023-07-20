import BackDrop from '@/components/ui/open/BackDrop';
import { BottomSheetContainer, BottomSheetHeader } from '@/components/ui/open/bottomSheet/atoms';
import { IPrompts } from '<UIPrompts>';

export interface IPostOptionsBottomSheetProps {}

const PostOptionsBottomSheet = ({ closePrompt }: IPostOptionsBottomSheetProps & IPrompts) => {
    return (
        <BackDrop close={closePrompt}>
            <BottomSheetContainer height={100}>
                <BottomSheetHeader />
                신고하기
            </BottomSheetContainer>
        </BackDrop>
    );
};

export default PostOptionsBottomSheet;
