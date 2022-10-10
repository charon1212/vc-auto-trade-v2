import { cancelOrder } from "../../lib/coincheck/interface/cancelOrder";
import { fetchOrderIsCancel } from "../../lib/coincheck/interface/fetchOrderIsCancel";
import { Trade } from "../BaseType";
import { penaltyCounter } from "../PenaltyCounter/PenaltyCounter";
import { ITradeCancelManager } from "./ITradeCancelManager";

export type CancelSubscription = {
  strategyBoxId: string,
  cancelList: Trade[],
  proceed: () => void | Promise<void>,
};

class TradeCancelManager implements ITradeCancelManager {

  private subscriptions: (CancelSubscription & { proceedCalled: boolean, })[] = [];

  constructor() { };

  setup() {
    setInterval(this.scheduleCancelStatusCheck, 1000);
  };

  private scheduleCancelStatusCheck() {
    this.subscriptions.forEach(async (sub) => {
      const { strategyBoxId, cancelList, proceed } = sub;
      for (let cancelTrade of cancelList) {
        const resultCancelComplete = await fetchOrderIsCancel(+cancelTrade.apiId);
        if (resultCancelComplete.isEr) {
          this.removeSubscription(sub);
          return penaltyCounter.addYellowCard(strategyBoxId, 'fail fetchOrderIsCancel(+cancelTrade.apiId);');
        }
        // @ts-ignore  ts-jestがここをエラーとしてしまい、テストできないための暫定措置。POSTしてみたけど反応なし：https://github.com/kulshekhar/ts-jest/issues/3860
        const isCancelComplete = resultCancelComplete.ok;
        if (!isCancelComplete) return;
        // TODO: キャンセル状態への変更。
      }
      this.removeSubscription(sub);
      if (!sub.proceedCalled) {
        sub.proceedCalled = true;
        await proceed();
      }
    });
  };

  async subscribe(sub: CancelSubscription) {
    const { strategyBoxId, cancelList, proceed } = sub;
    if (cancelList.length === 0) {
      return await proceed();
    }
    for (let cancelTrade of cancelList) {
      const result = await cancelOrder(cancelTrade);
      if (result.isEr) return penaltyCounter.addRedCard(strategyBoxId, `fail cancelOrder(cancelTrade);`);
    }
    this.subscriptions.push({ ...sub, proceedCalled: false });
  };

  unsubscribe(strategyBoxId?: string) {
    if (strategyBoxId) this.subscriptions = this.subscriptions.filter((v) => v.strategyBoxId !== strategyBoxId);
    else this.subscriptions = [];
  };

  private removeSubscription(sub: CancelSubscription) {
    this.subscriptions = this.subscriptions.filter((v) => v !== sub);
  };
};

export const tradeCancelManager = new TradeCancelManager();
