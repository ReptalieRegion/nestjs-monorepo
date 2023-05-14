interface ILabelProps {
    htmlFor: string;
    title: string;
    required?: boolean;
}

const SignUpLabel = ({ htmlFor, title, required }: ILabelProps) => {
    return (
        <label htmlFor={htmlFor} className="text-sm block mb-10pxr">
            <span>{title}</span>
            {required && <span className="text-red-500"> *</span>}
        </label>
    );
};

export default SignUpLabel;
