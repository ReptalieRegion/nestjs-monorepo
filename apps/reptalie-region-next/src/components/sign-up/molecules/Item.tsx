'use client';

import { ForwardedRef, forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form/dist/types';
import SignUpErrorMessage from '../atoms/ErrorMessage';
import SignUpLabel from '../atoms/Label';
import InputText from '@/components/ui/element/input/InputText';
import { IInputInfoArray } from '<SignUp>';

interface ISignUpInputItemProps {
    itemInfo: IInputInfoArray;
    errorMessage: string;
    register: UseFormRegisterReturn;
}

const InputItem = ({ itemInfo, errorMessage, register }: ISignUpInputItemProps, ref: ForwardedRef<HTMLInputElement>) => {
    const { id, placeholder, title } = itemInfo;
    const inputTestProps = { name: id, id, placeholder };

    return (
        <div key={id} className="mb-20pxr">
            <SignUpLabel htmlFor={id} title={title} required={register.required} />
            <InputText {...inputTestProps} {...register} />
            <SignUpErrorMessage errorMessage={errorMessage} />
        </div>
    );
};

export default forwardRef(InputItem);
