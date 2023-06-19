export interface INavigate {
    push: (payload: TPushPayload) => void;
}

export type TPushPayload = {
    route: string;
    params: unknown;
};
