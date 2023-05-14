'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldValues, useForm } from 'react-hook-form';

import InputItem from '../molecules/Item';
import { IInputInfoArray, ISignUpFormValue } from '@/types/signUp';
import { createUserSchema } from '@/validations/signUp';

const inputInfoArray: IInputInfoArray[] = [
    {
        id: 'email',
        placeholder: '이메일을 입력해주세요.',
        title: '이메일',
    },
    {
        id: 'password',
        placeholder: '비밀번호를 입력해주세요.',
        title: '비밀번호',
    },
    {
        id: 'passwordConfirm',
        placeholder: '비밀번호를 한번 더 입력해주세요.',
        title: '비밀번호 확인',
    },
    {
        id: 'nickname',
        placeholder: '닉네임를 입력해주세요.',
        title: '닉네임',
    },
];

const createUser = (data: FieldValues) => {
    console.log(data);
};

const SignUpForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ISignUpFormValue>({
        resolver: yupResolver(createUserSchema),
    });

    return (
        <section>
            <form onSubmit={handleSubmit(createUser)}>
                {inputInfoArray.map((inputInfo) => {
                    const result = register(inputInfo.id);

                    return (
                        <InputItem
                            key={inputInfo.id}
                            register={result}
                            itemInfo={inputInfo}
                            errorMessage={errors[inputInfo.id]?.message as string}
                        />
                    );
                })}
                <button type="submit" className="w-full text-white bg-teal-250 rounded p-10pxr text-sm">
                    다음
                </button>
            </form>
        </section>
    );
};

export default SignUpForm;
