import { startup } from "./startup";
import { marketMonitor } from "./domain/Market/MarketMonitor";

const indexMarketMonitor = async () => {
  startup('vcat2-MarketMonitor');
  marketMonitor.setup();
};

indexMarketMonitor();
