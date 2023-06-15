import { rest } from 'msw';

export const handlers = [
    rest.get('http://localhost:3333/api/posts', (req, res, ctx) => {
        return res(
            ctx.json([
                {
                    userId: 1,
                    postId: 1,
                    profile: {
                        src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fimgnews.naver.net%2Fimage%2F009%2F2022%2F06%2F08%2F0004974574_002_20220608070201911.jpg&type=a340',
                        alt: '윤댕',
                    },
                    name: '윤댕',
                    isFollow: true,
                    isLike: false,
                    content: '재밌다크크크크ㅡ크크크킄크크ㅡ크크킄sadfsdafsadfdsafsafasdfsddsfafasdfadsafsdafdsaㅁㅁㄴ',
                    images: [
                        {
                            src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjEwMThfMTAg%2FMDAxNjY2MDIwODEwMjI5.OEAESH8ghoCRHec1CyCTXZ7WJqBsdTdi2abw-CPvq7Eg.V4SCl2BVP0t9U3EinnxmHSd7bE-JqRWkSBygOKIXAW4g.JPEG.koomio78%2F20221016%25A3%25DF184656.jpg&type=a340',
                            alt: '1',
                        },
                        {
                            src: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fdbscthumb-phinf.pstatic.net%2F2765_000_15%2F20180816183416018_EHG0GK4VT.jpg%2F9528165.jpg%3Ftype%3Dm4500_4500_fst&type=a340',
                            alt: '2',
                        },
                        {
                            src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjExMjVfMTM0%2FMDAxNjY5MzMyNDQxOTY5.kS_xyMlxR2oc1rrquiRdIk9DIjg1jRm_IHGhtVnmMPMg.hOHkogafU5YF-fWDiR_DveXVcy-QXPbCyXfkSDxVEB8g.JPEG.petpetloveing%2FKakaoTalk_20221001_022055810_04.jpg&type=a340',
                            alt: '3',
                        },
                    ],
                    commentCount: 10,
                    likeCount: 210,
                },
                {
                    userId: 3,
                    postId: 3,
                    profile: {
                        src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzAyMDRfMTYx%2FMDAxNjc1NDk3OTk1MTU1.WG_RwuEyaWuCp2snK8kRAFVzrFwbhLQ-0p9hn1sNKEgg.jzih-q7NXG3MOX6ZDyM53QPd-RduBTGRMllv68JkKMMg.JPEG.alstjddlzz%2F20230129%25A3%25DF135424.jpg&type=a340',
                        alt: '승댕',
                    },
                    name: '승댕',
                    isFollow: false,
                    isLike: true,
                    content: '안녕하세요 ㅎㅎㅎㅎ 제 도마뱀이예요',
                    images: [
                        {
                            src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzAyMDRfMTYx%2FMDAxNjc1NDk3OTk1MTU1.WG_RwuEyaWuCp2snK8kRAFVzrFwbhLQ-0p9hn1sNKEgg.jzih-q7NXG3MOX6ZDyM53QPd-RduBTGRMllv68JkKMMg.JPEG.alstjddlzz%2F20230129%25A3%25DF135424.jpg&type=a340',
                            alt: '6',
                        },
                        {
                            src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzAzMTJfODQg%2FMDAxNjc4NTk4NDcxMjE4.rUgrsfgKTY-sIRD_H4V4bDj4POmlJgOo0wGZ3mnLpBkg.O60phJ09jdgyzntSyUVeqjxlFv4zCydDKCns38vha5Mg.JPEG.wngks1025%2FKakaoTalk_20230312_141150340.jpg&type=a340',
                            alt: '7',
                        },
                        {
                            src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzAzMTJfODQg%2FMDAxNjc4NTk4NDcxMjE4.rUgrsfgKTY-sIRD_H4V4bDj4POmlJgOo0wGZ3mnLpBkg.O60phJ09jdgyzntSyUVeqjxlFv4zCydDKCns38vha5Mg.JPEG.wngks1025%2FKakaoTalk_20230312_141150340.jpg&type=a340',
                            alt: '8',
                        },
                    ],
                    commentCount: 20,
                    likeCount: 400,
                },
                {
                    userId: 2,
                    postId: 2,
                    profile: {
                        src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjA5MDZfMjM3%2FMDAxNjYyNDU2MzIzMDUx.TLoNbxwQK96UWdztLcDvIe7h80NAuGVvArIagUPSRmIg.PMA8e89h-1XK9JGRsmQLc5RusR6yXj6pz-9b52V5U6gg.JPEG.companion_gecko%2F1.jpg&type=a340',
                        alt: '상댕',
                    },
                    name: '상댕',
                    isFollow: false,
                    isLike: true,
                    content: '재밌다크크크크ㅡ크크크킄크크ㅡ크크킄sadfsdafsadfdsafsafasdfsddsfafasdfadsafsdafdsa',
                    images: [
                        {
                            src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjA5MDZfMjM3%2FMDAxNjYyNDU2MzIzMDUx.TLoNbxwQK96UWdztLcDvIe7h80NAuGVvArIagUPSRmIg.PMA8e89h-1XK9JGRsmQLc5RusR6yXj6pz-9b52V5U6gg.JPEG.companion_gecko%2F1.jpg&type=a340',
                            alt: '4',
                        },
                        {
                            src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjA5MDZfMjM3%2FMDAxNjYyNDU2MzIzMDUx.TLoNbxwQK96UWdztLcDvIe7h80NAuGVvArIagUPSRmIg.PMA8e89h-1XK9JGRsmQLc5RusR6yXj6pz-9b52V5U6gg.JPEG.companion_gecko%2F1.jpg&type=a340',
                            alt: '5',
                        },
                    ],
                    commentCount: 10,
                    likeCount: 30,
                },
                {
                    userId: 4,
                    postId: 4,
                    profile: {
                        src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzA0MjRfMTAy%2FMDAxNjgyMzMwNTkzNjcw.yX7d_IkruiV1dylsugUStI1g4ytJdm6bKvvDmMDwg1og.YcGsY1O8pc4fZKZtXaQ5MFyOT9c_onvKeXki-tz5ftMg.JPEG.gmldns3626%2F1679568711217%25A3%25AD0.jpg&type=a340',
                        alt: '홍길동',
                    },
                    name: '홍길동',
                    isFollow: true,
                    isLike: true,
                    content: '나는 홍길동이다 크크크',
                    images: [
                        {
                            src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzA0MjRfMTAy%2FMDAxNjgyMzMwNTkzNjcw.yX7d_IkruiV1dylsugUStI1g4ytJdm6bKvvDmMDwg1og.YcGsY1O8pc4fZKZtXaQ5MFyOT9c_onvKeXki-tz5ftMg.JPEG.gmldns3626%2F1679568711217%25A3%25AD0.jpg&type=a340',
                            alt: '9',
                        },
                        {
                            src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzA0MjRfMTAy%2FMDAxNjgyMzMwNTkzNjcw.yX7d_IkruiV1dylsugUStI1g4ytJdm6bKvvDmMDwg1og.YcGsY1O8pc4fZKZtXaQ5MFyOT9c_onvKeXki-tz5ftMg.JPEG.gmldns3626%2F1679568711217%25A3%25AD0.jpg&type=a340',
                            alt: '10',
                        },
                        {
                            src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzA0MjRfMTAy%2FMDAxNjgyMzMwNTkzNjcw.yX7d_IkruiV1dylsugUStI1g4ytJdm6bKvvDmMDwg1og.YcGsY1O8pc4fZKZtXaQ5MFyOT9c_onvKeXki-tz5ftMg.JPEG.gmldns3626%2F1679568711217%25A3%25AD0.jpg&type=a340',
                            alt: '11',
                        },
                    ],
                    commentCount: 0,
                    likeCount: 101,
                },
                {
                    userId: 5,
                    postId: 5,
                    profile: {
                        src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzAyMTdfMTc4%2FMDAxNjc2NTcxNDM0MzA4.e1cayk1t8UodEqe-Zy0_psehL0FKHMNFQeIJH0thk6Eg.0Q5hkt8ysj2SPSeiHOA4_KHgj_jUVQ9QJxH1JOVNJiEg.JPEG.cxrr0101%2F1676571432937.jpg&type=a340',
                        alt: '도맹',
                    },
                    name: '도맹',
                    isFollow: true,
                    isLike: true,
                    content: '바보바보',
                    images: [
                        {
                            src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzAyMTdfMTc4%2FMDAxNjc2NTcxNDM0MzA4.e1cayk1t8UodEqe-Zy0_psehL0FKHMNFQeIJH0thk6Eg.0Q5hkt8ysj2SPSeiHOA4_KHgj_jUVQ9QJxH1JOVNJiEg.JPEG.cxrr0101%2F1676571432937.jpg&type=a340',
                            alt: '12',
                        },
                        {
                            src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzAyMTdfMTc4%2FMDAxNjc2NTcxNDM0MzA4.e1cayk1t8UodEqe-Zy0_psehL0FKHMNFQeIJH0thk6Eg.0Q5hkt8ysj2SPSeiHOA4_KHgj_jUVQ9QJxH1JOVNJiEg.JPEG.cxrr0101%2F1676571432937.jpg&type=a340',
                            alt: '13',
                        },
                        {
                            src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzAyMTdfMTc4%2FMDAxNjc2NTcxNDM0MzA4.e1cayk1t8UodEqe-Zy0_psehL0FKHMNFQeIJH0thk6Eg.0Q5hkt8ysj2SPSeiHOA4_KHgj_jUVQ9QJxH1JOVNJiEg.JPEG.cxrr0101%2F1676571432937.jpg&type=a340',
                            alt: '14',
                        },
                    ],
                    commentCount: 101,
                    likeCount: 10,
                },
            ]),
        );
    }),
    // 추가로 필요한 다른 엔드포인트를 여기에 추가
];