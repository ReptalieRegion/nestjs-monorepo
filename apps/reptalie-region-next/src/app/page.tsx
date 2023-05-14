import Link from 'next/link';

const Page = () => {
    return (
        <>
            <Link href={'/auth/sign-in'} className="block">
                로그인
            </Link>
            <Link href={'/auth/sign-up'} className="block">
                회원가입
            </Link>
            <Link href={'/home'} className="block">
                홈
            </Link>
        </>
    );
};

export default Page;
