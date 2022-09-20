export type ExpressResponse<ResponseData extends object> = ExpressSuccessResponse<ResponseData> | ExpressFailureResponse;

export type ExpressSuccessResponse<ResponseData extends object> = {
  success: true,
  data: ResponseData,
};

export type ExpressFailureResponse = {
  success: false,
  message: string[],
};

export const createSuccessResponse = <ResponseData extends object>(data: ResponseData): ExpressSuccessResponse<ResponseData> => ({ success: true, data })
export const createFailureResponse = (message: string[]): ExpressFailureResponse => ({ success: false, message });
