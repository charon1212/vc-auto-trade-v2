import { startup } from "./startup";
import { StrategyBox1 } from "./domain/strategyBox/strategyBox1/StrategyBox1";
import { StrategyBoxContainer } from "./domain/strategyBoxContainer/strategyBoxContainer";

const index = async () => {

  await startup();

  const container = new StrategyBoxContainer();
  const params = [
    { th: 2, rev: true, dummy: true },
    { th: 3, rev: true, dummy: true },
    { th: 4, rev: true, dummy: true },
    { th: 5, rev: true, dummy: true },
    { th: 2, rev: false, dummy: true },
    { th: 3, rev: false, dummy: true },
    { th: 4, rev: false, dummy: true },
    { th: 5, rev: false, dummy: true },
  ];
  for (let param of params) {
    const { th, rev, dummy } = param;
    container.addStrategyBox('btc_jpy', StrategyBox1.getCreator({ id: `sb-1-th${th}${rev ? '-reverse' : ''}` }, (instance) => {
      instance.isDummy = dummy;
      instance.param.reverse = rev;
      instance.param.threshold = 0.0001 * th;
      return instance;
    }))
  }
  container.start();

};

index();
