'use client';

import PostOptionsBottomSheet, {
    IPostOptionsBottomSheetProps,
} from '@/components/home/share/list/ui-prompts/bottomSheet/PostOptionsBottomSheet';
import MoreIcon from '@/assets/icons/more.svg';
import useUIPromptManager from '@/hooks/useUIPromptManager';

const PostKebabMenu = () => {
    const { openPrompt } = useUIPromptManager();

    const handleOpenBottomSheet = () => {
        openPrompt<IPostOptionsBottomSheetProps>({
            Component: PostOptionsBottomSheet,
            promptType: 'bottomSheet',
            props: {},
        });
    };

    return (
        <div onClick={handleOpenBottomSheet}>
            <MoreIcon />
        </div>
    );
};

export default PostKebabMenu;
