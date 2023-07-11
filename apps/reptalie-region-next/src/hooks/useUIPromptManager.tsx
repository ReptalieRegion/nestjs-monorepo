import { IPrompts, TUIPromptsType } from '<UIPrompts>';
import uiPromptStore from '@/stores/ui-prompts';
import { createRoot } from 'react-dom/client';

interface IUIPromptsProps<T> {
    promptType: TUIPromptsType;
    props: T;
    Component: (props: T & IPrompts) => JSX.Element;
}

const useUIPromptManager = () => {
    const { setUIPrompt, getUIPrompt } = uiPromptStore();

    const openPrompt = <T,>({ promptType, Component, props }: IUIPromptsProps<T>) => {
        const prompt = getUIPrompt(promptType);
        const openElement = document.getElementById(promptType);
        if (prompt || !openElement) {
            return;
        }

        const root = createRoot(openElement);
        root.render(<Component {...props} closePrompt={() => closePrompt(promptType)} />);
        setUIPrompt({ promptType, root });
    };

    const closePrompt = (promptType: TUIPromptsType) => {
        const prompt = getUIPrompt(promptType);
        if (prompt) {
            prompt.unmount();
            setUIPrompt({ promptType, root: null });
        }
    };

    return { openPrompt, closePrompt };
};

export default useUIPromptManager;
