interface ISignUpErrorMessage {
    errorMessage: string;
}

const SignUpErrorMessage = ({ errorMessage }: ISignUpErrorMessage) => {
    return <div className="text-end text-red-500 text-xs h-16pxr">{errorMessage}</div>;
};

export default SignUpErrorMessage;
