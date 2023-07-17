import { BridgeFunction } from '../common/function';

export interface INavigate {
    push: BridgeFunction<TPushPayload, void>;
}

export type TPushPayload = {
    route: string;
    params?: unknown;
};
