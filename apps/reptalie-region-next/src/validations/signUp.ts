import { object, ref, string } from 'yup';

declare module 'yup' {
    interface StringSchema {
        emailDuplicateCheck: (event: unknown) => Promise<boolean>;
    }
}

/**
 * @description 회원가입 form 유효성
 */
export const createUserSchema = object().shape({
    email: string()
        .email('이메일 형식에 맞지 않습니다.')
        .test({
            name: 'emailDuplicateCheck',
            exclusive: false,
            message: '중복된 이메일입니다.',
            test: async function (value) {
                if (!value) {
                    return true;
                }

                return !(await emailDuplicateCheck(value));
            },
        })
        .required('아이디는 필수입니다.'),
    nickname: string()
        .required('닉네임은 필수입니다.')
        .min(3, '3글자 이상으로 작성해주세요.')
        .max(7, '7글자 이하로 작성해주세요.'),
    password: string()
        .required('패스워드는 필수입니다.')
        .min(8, '8글자 이상으로 작성해주세요.')
        .max(30, '30글자 이하로 작성해주세요'),
    passwordConfirm: string()
        .oneOf([ref('password')], '비밀번호가 일치하지 않습니다.')
        .required('패스워드 확인은 필수입니다.'),
});

export const emailDuplicateCheck = async (email: string) => {
    return fetch(`http://localhost:3333/api/users/email-exists?email=${email}`, {
        method: 'GET',
    }).then((res) => res.json());
};
