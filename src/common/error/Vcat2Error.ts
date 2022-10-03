export class Vcat2Error<Content = unknown> {
  private readonly __brand_vcat2_error = '__brand_vcat2_error';
  constructor(public filename: string, public errorContent: Content, protected readonly type = '') { };
  static is(e: any): e is Vcat2Error {
    return typeof e === 'object' && e.__brand_vcat2_error === '__brand_vcat2_error';
  };
};

export type ErrorContentCoincheckApi = {
  isApiResponseError: true,
  param: object,
  responseBody: unknown,
} | {
  isApiResponseError: false,
  param: object,
  error: unknown,
};
const typeVcat2ErrorCoincheckApi = 'Vcat2ErrorCoincheckApi';
export class Vcat2ErrorCoincheckApi extends Vcat2Error<ErrorContentCoincheckApi> {
  constructor(filename: string, errorContent: ErrorContentCoincheckApi) {
    super(filename, errorContent, typeVcat2ErrorCoincheckApi);
  };
  static is(e: any): e is Vcat2ErrorCoincheckApi {
    return e && e.__brand_vcat2_error === '__brand_vcat2_error' && e.type === typeVcat2ErrorCoincheckApi;
  };
  isEconresetError() {
    if (this.errorContent.isApiResponseError) return false;
    const error = (this.errorContent as any).error as any; // なぜかts-jest@29.0.1でこのコンパイルが通らない（1個上のif文Narrowingが効かない）ので、苦肉の策。
    return error
      && error['errno'] === 'ECONNRESET'
      && error['code'] === 'ECONNRESET';
  }
};
