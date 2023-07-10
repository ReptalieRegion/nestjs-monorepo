declare module '*.svg' {
    import { FC, SVGProps } from 'react';
    const content: FC<SVGProps<SVGAElement>>;
    export const ReactComponent: FC<SVGProps<SVGAElement>>;
    export default content;
}
