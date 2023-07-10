declare module '<Header>' {
    import { ReactNode } from 'react';

    type TLeftIcon = 'back' | 'logo' | 'cancel';

    interface IHeaderProps {
        left?: TLeftIcon;
        center?: ReactNode;
        right?: ReactNode;
    }
}
