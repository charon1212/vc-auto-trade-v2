import { startup } from "./startup";
import { StrategyBoxContainer } from "./domain/strategyBoxContainer/strategyBoxContainer";
import { registerStrategyBox } from "./domain/strategyBoxContainer/registerStrategyBox";

/**
 * メインサーバーを起動する。以下の処理を実施する。
 *
 * - startup処理を実施する。
 * - StrategyBoxContainerにStrategyBoxを登録し、管理を開始する。
 */
const index = async () => {

  console.log('start vc-auto-trade-v2');
  // 初期化処理
  await startup();

  // StrategyBoxContainer生成。
  const container = new StrategyBoxContainer();
  // StrategyBoxを、containerに登録。
  registerStrategyBox(container);
  // 取引スタート
  container.start();

  console.log('complete startup vc-auto-trade-v2');

};

index();
