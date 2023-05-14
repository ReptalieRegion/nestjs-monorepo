import Link from 'next/link';

const SignIn = () => {
    return (
        <div className="p-15pxr">
            <input
                type="text"
                className="w-full border border-gray-300 mt-2pxr p-10pxr rounded"
                placeholder="아이디를 입력해주세요."
            />
            <input
                type="text"
                className="w-full border border-gray-300 border-solid mt-5pxr p-10pxr rounded"
                placeholder="비밀번호를 입력해주세요."
            />
            <button type="submit" className="w-full text-white bg-cyan-300 mt-15pxr p-10pxr text-sm rounded">
                로그인
            </button>
            <Link href="/signUp" className="block w-full p-10pxr border border-cyan-300 mt-10pxr text-sm rounded text-center">
                회원가입
            </Link>
            <div className="flex justify-end mt-5pxr text-sm text-gray-400 items-center">
                <div>아이디 찾기</div>
                <div className="ml-5pxr mr-5pxr text-xs">|</div>
                <div>비밀번호 찾기</div>
            </div>
        </div>
    );
};

export default SignIn;
