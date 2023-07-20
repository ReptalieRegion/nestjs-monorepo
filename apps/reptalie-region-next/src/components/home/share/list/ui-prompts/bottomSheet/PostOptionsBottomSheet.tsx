import BackDrop from '@/components/ui/open/BackDrop';
import { BottomSheetContainer, BottomSheetHeader } from '@/components/ui/open/bottomSheet/atoms';
import { IPrompts } from '<UIPrompts>';
import BottomSheetContent from '@/components/ui/open/bottomSheet/atoms/BottomSheetContent';

export interface IPostOptionsBottomSheetProps {}

const PostOptionsBottomSheet = ({ closePrompt }: IPostOptionsBottomSheetProps & IPrompts) => {
    return (
        <BackDrop close={closePrompt}>
            <BottomSheetContainer height={100}>
                <BottomSheetHeader />
                <BottomSheetContent>
                    <div>신고하기</div>
                </BottomSheetContent>
            </BottomSheetContainer>
        </BackDrop>
    );
};

export default PostOptionsBottomSheet;
