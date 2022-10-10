import { CancelSubscription } from "./TradeCancelManager";

export interface ITradeCancelManager {
  subscribe: (sub: CancelSubscription) => Promise<void>;
};
