import { Root } from 'react-dom/client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TUIPromptsType } from '<UIPrompts>';

type TUIPrompts = {
    [key in TUIPromptsType]: Root | null;
};

interface IUIPromptInfo {
    root: Root | null;
    promptType: TUIPromptsType;
}

interface IUIPromptState {
    prompts: TUIPrompts;
}

interface IUIPromptActions {
    getUIPrompt: (promptType: TUIPromptsType) => Root | null;
    setUIPrompt: ({ promptType, root }: IUIPromptInfo) => void;
}

const defaultSharePostsState: IUIPromptState = {
    prompts: {
        modal: null,
        bottomSheet: null,
        toast: null,
        alert: null,
    },
};

const uiPromptStore = create<IUIPromptState & IUIPromptActions>()(
    devtools((set, get) => ({
        ...defaultSharePostsState,
        setUIPrompt: ({ promptType, root }) => {
            const { prompts } = get();
            const newPrompts = {
                ...prompts,
                [promptType]: root,
            };
            set((state) => ({ ...state, prompts: newPrompts }));
        },
        getUIPrompt: (promptType) => {
            const { prompts } = get();
            return prompts[promptType];
        },
    })),
);
export default uiPromptStore;
