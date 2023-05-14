import { ForwardedRef, InputHTMLAttributes, forwardRef } from 'react';

interface IInputBaseProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
    width?: number;
}

const InputText = ({ ...props }: IInputBaseProps, ref: ForwardedRef<HTMLInputElement>) => {
    return <input ref={ref} type="text" className="text-xs p-10pxr border border-gray-300 block rounded w-full" {...props} />;
};
export default forwardRef(InputText);
