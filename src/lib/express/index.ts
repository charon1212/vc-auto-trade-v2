import { startup } from '../../startup';
import { app } from './app';
import { commonSetting } from './common/commonSetting';
import { route } from './common/route';

const index = async () => {

  await startup('vcat2-express');
  commonSetting();

  app.listen(3000, () => { console.log('start on port 3000.'); });

  route();

};

// エントリーポイント
index();
