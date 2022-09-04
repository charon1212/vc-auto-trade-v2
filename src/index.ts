import { startup } from "./startup";
import { tradeManager } from "./domain/Trade/TradeManager";
import { strategyBoxContainer } from "./domain/StrategyBoxContainer/StrategyBoxContainer";

/**
 * メインサーバーを起動する。以下の処理を実施する。
 *
 * - startup処理を実施する。
 * - StrategyBoxContainerにStrategyBoxを登録し、管理を開始する。
 */
const index = async () => {

  console.log('start vc-auto-trade-v2');
  // 初期化処理
  await startup(true);

  // TradeManager初期化
  tradeManager.setupCache();
  // SBContainer初期化
  strategyBoxContainer.startup();

  console.log('complete startup vc-auto-trade-v2');

};

index();
