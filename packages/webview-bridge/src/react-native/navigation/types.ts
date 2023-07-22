import { BridgeFunction } from '@/common';

export interface INavigate {
    push: BridgeFunction<TPushPayload, void>;
}

export type TPushPayload = {
    route: string;
    params?: unknown;
};
