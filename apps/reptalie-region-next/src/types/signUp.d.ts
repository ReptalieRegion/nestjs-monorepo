export type TInputInfoKey = 'user-email' | 'user-nickname' | 'user-password' | 'user-password-confirm';
export interface ISignUpFormValue {
    email: string;
    nickname: string;
    password: string;
    passwordConfirm: string;
}

export interface IInputInfoArray {
    id: keyof ISignUpFormValue;
    placeholder: string;
    title: string;
}
