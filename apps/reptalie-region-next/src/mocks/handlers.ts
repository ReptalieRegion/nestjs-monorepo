import { rest } from 'msw';

export const handlers = [
    rest.get('http://localhost:3333/api/users/posts', (req, res, ctx) => {
        return res(
            ctx.json([
                {
                    id: 1,
                    title: 'My first post',
                    content: 'Hello, this is my first post!',
                    author: 'John Doe',
                },
            ]),
        );
    }),
    // 추가로 필요한 다른 엔드포인트를 여기에 추가
];
