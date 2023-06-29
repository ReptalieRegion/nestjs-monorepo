declare module '<API>' {
    type TImage = {
        src: StaticImport;
        alt: string;
    };

    type TFollow = {
        postId: string;
        isFollow: boolean;
    };

    interface IPostsData {
        userId: number;
        postId: string;
        profile: TImage;
        name: string;
        isLike: boolean;
        isFollow: boolean;
        content: string;
        images: TImage[];
        likeCount: number;
        commentCount: number;
    }

    type TPostsInfo = {
        postsId: string;
        thumbnail: TImage;
    };

    interface IDetailPostsData {
        nickname: string;
        name: string;
        followerCount: number;
        followingCount: number;
        profile: TImage;
        posts: TPostsInfo[];
    }
}
