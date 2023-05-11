export interface IJwtPayload {
    sub: {
        id: string;
    };
    iat: number;
    exp: number;
}
