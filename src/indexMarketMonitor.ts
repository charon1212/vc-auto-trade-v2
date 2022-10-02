import { marketMonitor } from "./domain/Market/MarketMonitor";
import { startup } from "./startup";

const indexMarketMonitor = async () => {
  startup('vcat2-MarketMonitor');
  marketMonitor.setup();
};

indexMarketMonitor();
