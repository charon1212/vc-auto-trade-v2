import { startup } from "./startup";
import { StrategyBox1 } from "./domain/strategyBox/strategyBox1/StrategyBox1";
import { StrategyBoxContainer } from "./domain/strategyBoxContainer/strategyBoxContainer";

const index = async () => {

  await startup();

  const container = new StrategyBoxContainer();
  container.addStrategyBox('btc_jpy', StrategyBox1.getCreator({ id: 'sb-1' }, (instance) => {
    instance.isDummy = true;
    return instance;
  }));
  container.addStrategyBox('btc_jpy', StrategyBox1.getCreator({ id: 'sb-1-reverse' }, (instance) => {
    instance.isDummy = true;
    instance.param.reverse = true;
    return instance;
  }));
  container.addStrategyBox('btc_jpy', StrategyBox1.getCreator({ id: 'sb-1-threshold2' }, (instance) => {
    instance.isDummy = true;
    instance.param.threshold = 0.0002;
    return instance;
  }));
  container.start();

};

index();
