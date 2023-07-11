declare module '<SignUp>' {
    type TInputInfoKey = 'user-email' | 'user-nickname' | 'user-password' | 'user-password-confirm';
    interface ISignUpFormValue {
        email: string;
        nickname: string;
        password: string;
        passwordConfirm: string;
    }

    interface IInputInfoArray {
        id: keyof ISignUpFormValue;
        placeholder: string;
        title: string;
    }
}
