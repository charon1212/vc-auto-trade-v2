export class Vcat2Error<Content = unknown> {
  private __brand_vcat2_error = '__brand_vcat2_error';
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
    return typeof e === 'object' && e.__brand_vcat2_error === '__brand_vcat2_error' && e.type === typeVcat2ErrorCoincheckApi;
  };
};
