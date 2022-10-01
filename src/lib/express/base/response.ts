export type ExpressResponse<ResponseData> = ExpressSuccessResponse<ResponseData> | ExpressFailureResponse;

export type ExpressSuccessResponse<ResponseData> = {
  success: true,
  data: ResponseData,
};

export type ExpressFailureResponse = {
  success: false,
  message: string[],
};

export const createSuccessResponse = <ResponseData>(data: ResponseData): ExpressSuccessResponse<ResponseData> => ({ success: true, data })
export const createFailureResponse = (message: string[]): ExpressFailureResponse => ({ success: false, message });
