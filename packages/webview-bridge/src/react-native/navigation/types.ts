import { BridgeFunction } from '../../common';

export type TPushPayload = {
    route: string;
    params?: unknown;
};

export interface INavigation {
    push: BridgeFunction<TPushPayload, void>;
}
