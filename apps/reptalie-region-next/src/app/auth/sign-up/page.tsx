import ContainerWithAppbar from '@/components/ContainerContent/ContainerWithAppbar';
import SignUpForm from '@/components/sign-up';

export default function SignUpPage() {
    return (
        <ContainerWithAppbar title="회원가입">
            <SignUpForm />
        </ContainerWithAppbar>
    );
}
