import { Strategy } from "../Strategy";
import { ReportSample, strategySample } from "./sample/strategySample";

export const strategyList: Strategy<any, any, Report>[] = [];
strategyList.push(strategySample as Strategy<any, any, Report>);

export type StrategyId = 'strategy-sample' | 'strategy-sample-2';

type ReportType = {
  'strategy-sample': ReportSample,
  'strategy-sample-2': { test4: number[] },
};

export type Report = ReportType[StrategyId];
