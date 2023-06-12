declare module '<UIPrompts>' {
    type TUIPromptsType = 'modal' | 'bottomSheet' | 'toast' | 'alert';

    interface IPrompts extends JSX.IntrinsicAttributes {
        closePrompt: () => void;
    }
}
