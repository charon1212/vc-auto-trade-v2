import { startup } from '../../startup';
import { app } from './app';
import { commonSetting } from './common/commonSetting';
import { route } from './common/route';

const index = async () => {

  await startup(false);
  commonSetting();

  app.listen(3000, () => { console.log('start on port 3000.'); });

  route();

};

// エントリーポイント
index();
