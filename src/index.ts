import { startup } from "./startup";
import { tradeManager } from "./domain/Trade/TradeManager";
import { strategyBoxContainer } from "./domain/StrategyBoxContainer/StrategyBoxContainer";
import { tradeManagerForwardTest } from "./domain/ForwardTest/TradeManagerForwardTest";
import { marketPolling } from "./domain/Market/MarketPolling";
import { marketCache } from "./domain/Market/MarketCache";
import { reportManager } from "./domain/Report/ReportManager";

/**
 * メインサーバーを起動する。以下の処理を実施する。
 *
 * - startup処理を実施する。
 * - StrategyBoxContainerにStrategyBoxを登録し、管理を開始する。
 */
const index = async () => {

  console.log('start vc-auto-trade-v2');
  // 初期化処理
  await startup('vcat2-main');

  // marketPolling初期化
  marketPolling.setup();
  // marketCache初期化
  marketCache.setup();
  // reportManager初期化
  reportManager.setup();
  // TradeManager初期化
  await tradeManager.setupCache();
  await tradeManagerForwardTest.setupCache();
  // SBContainer初期化
  await strategyBoxContainer.startup();

  console.log('complete startup vc-auto-trade-v2');

};

index();
