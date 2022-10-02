import { startup } from "./startup";
import { timeMeasure } from "util-charon1212";
import { findMarket } from "./lib/typeorm/repository/Market/findMarket";

const debug = async () => {

  await startup('debug');

  const result = await timeMeasure((complete) => {
    findMarket({ pair: 'btc_jpy', limit: 10000, startTimestamp: 1664592503000 }).then((result) => {
      console.log(result);
      complete();
    });
  });

  console.log(`****** TIME MEASURE ******`);
  console.log(result);

};

debug();
