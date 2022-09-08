import { processEnv } from '../../../src/common/dotenv/processEnv';
import * as handleError from '../../../src/common/error/handleError';
import { logger } from '../../../src/common/log/logger';

export type SpyCommonParams = {
  mockProcessEnv?: Partial<typeof processEnv>,
};
export const spyCommon = (param?: SpyCommonParams) => {
  const mockProcessEnv = param?.mockProcessEnv;
  // processEnv
  for (let k in mockProcessEnv) (processEnv as any)[k] = (mockProcessEnv as any)[k];
  // handleError
  const spyHandleError = jest.spyOn(handleError, 'handleError').mockImplementation();
  // logger
  const error = jest.spyOn(logger, 'error').mockImplementation();
  const warn = jest.spyOn(logger, 'warn').mockImplementation();
  const info = jest.spyOn(logger, 'info').mockImplementation();
  const debug = jest.spyOn(logger, 'debug').mockImplementation();
  const trace = jest.spyOn(logger, 'trace').mockImplementation();

  return { spyHandleError, spyLogger: { error, warn, info, debug, trace } };

};
