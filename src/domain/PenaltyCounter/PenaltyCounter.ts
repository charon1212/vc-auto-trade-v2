import { MyDate } from "util-charon1212/build/main/MyDate";
import { handleErrorByMessage } from "../../common/error/handleError";
import { findPenalty } from "../../lib/typeorm/repository/Penalty/findPenalty";
import { insertPenalty } from "../../lib/typeorm/repository/Penalty/insertPenalty";
import { strategyBoxContainer } from "../StrategyBoxContainer/StrategyBoxContainer";
import { Penalty, PenaltyColor } from "./Penalty";

const yellowLimit = 3;

class PenaltyCounter {

  constructor() { };
  async addYellowCard(strategyBoxId: string, reason: string) { await this.addPenalty(strategyBoxId, reason, 'YELLOW'); }
  async addRedCard(strategyBoxId: string, reason: string) { await this.addPenalty(strategyBoxId, reason, 'RED'); }
  async addAllYellowCard(reason: string) { await this.addPenalty('', reason, 'YELLOW'); }
  async addAllRedCard(reason: string) { await this.addPenalty('', reason, 'RED'); }
  private async addPenalty(strategyBoxId: string, reason: string, color: PenaltyColor,) {
    const penalty: Penalty = { strategyBoxId, reason, color, point: color === 'YELLOW' ? 1 : 0, timestamp: Date.now(), };
    await insertPenalty(penalty);
    await this.dispatchError(strategyBoxId);
  }
  private async dispatchError(strategyBoxId: string) {
    const startTimestamp = Date.now() - MyDate.ms1d; // 1日前
    const penaltyList = await findPenalty(strategyBoxId, startTimestamp);
    const existRedPenalty = penaltyList.some(({ color }) => color === 'RED');
    const sumYellowPoint = penaltyList.map(({ point }) => point).reduce((p, c) => p + c, 0);
    if (existRedPenalty || sumYellowPoint >= yellowLimit) {
      const lastPenalty = penaltyList[penaltyList.length - 1];
      const logMessage = `ペナルティーエラー発生。直近1日のペナルティー一覧: ${JSON.stringify(penaltyList)}`;
      const slackMessage = `ペナルティーエラー発生。YellowCountが規定値（${yellowLimit}）を超過したか、またはRedPenaltyが発行されました。詳細はサーバーログを確認してください。`
        + (strategyBoxId ? `StrategyBoxId: [${strategyBoxId}]` : '')
        + `最新ペナルティー：${JSON.stringify(lastPenalty)}`;
      await handleErrorByMessage(logMessage, slackMessage);
      if (strategyBoxId) strategyBoxContainer.changeStatus('Error', strategyBoxId);
      else strategyBoxContainer.changeStatus('Sleep');
    }
  }
};

export const penaltyCounter = new PenaltyCounter();
