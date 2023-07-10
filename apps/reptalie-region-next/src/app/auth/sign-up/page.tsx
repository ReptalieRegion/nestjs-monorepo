import SignUpForm from '@/components/sign-up';
import ContainerWithAppbar from '@/components/ui/layouts/ContainerWithAppbar';

export default function SignUpPage() {
    return (
        <ContainerWithAppbar title="회원가입">
            <SignUpForm />
        </ContainerWithAppbar>
    );
}
