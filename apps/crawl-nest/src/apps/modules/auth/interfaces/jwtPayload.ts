export interface IJwtPayload {
    type: string;
    payload: { sub: { id: string } };
    iat: number;
    nbf: number;
    exp: number;
}
