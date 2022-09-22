import { app } from "../app";
import { createFailureResponse, ExpressResponse } from "./response";

/** ■　■　■　■　GET　■　■　■　■ */
export type ExpressGetArgs<RequestParam extends { [key: string]: string }, ResponseData extends object> = {
  url: string,
  handler: (param: RequestParam) => Promise<ExpressResponse<ResponseData>>,
  paramGuard: (param: any) => string[],
};

export const expressGet = <RequestParam extends { [key: string]: string }, ResponseData extends object>(args: ExpressGetArgs<RequestParam, ResponseData>) => {
  const { url, handler, paramGuard } = args;
  app.get(url, async (req, res) => {
    // RequestParam Check
    const param = req.params;
    const paramGuardResult = paramGuard(param);
    if (paramGuardResult.length !== 0) {
      res.statusCode = 400;
      res.send(JSON.stringify(createFailureResponse(paramGuardResult)));
      return;
    }

    // Execute Api Process
    const response = await handler(param as RequestParam);

    // Set Response
    if (response.success) {
      res.statusCode = 200;
      res.send(JSON.stringify(response));
    } else {
      res.statusCode = 500;
      res.send(JSON.stringify(response));
    }
  });
};

/** ■　■　■　■　POST　■　■　■　■ */
export type ExpressPostArgs<RequestParam extends { [key: string]: string }, RequestBody extends object, ResponseData extends object> = {
  url: string,
  handler: (param: RequestParam, body: RequestBody) => Promise<ExpressResponse<ResponseData>>,
  paramGuard: (param: any) => string[],
  bodyGuard: (body: any) => string[],
};

export const expressPost = <RequestParam extends { [key: string]: string }, RequestBody extends object, ResponseData extends object>(args: ExpressPostArgs<RequestParam, RequestBody, ResponseData>) => {
  const { url, handler, paramGuard, bodyGuard } = args;
  app.get(url, async (req, res) => {
    // RequestParam Check
    const param = req.params;
    const paramGuardResult = paramGuard(param);
    if (paramGuardResult.length !== 0) {
      res.statusCode = 400;
      res.send(JSON.stringify(createFailureResponse(paramGuardResult)));
      return;
    }
    // RequestBody Check
    const requestBody = req.body;
    const bodyGuardResult = bodyGuard(requestBody);
    if (bodyGuardResult.length !== 0) {
      res.statusCode = 400;
      res.send(JSON.stringify(createFailureResponse(bodyGuardResult)));
      return;
    }

    // Execute Api Process
    const response = await handler(param as RequestParam, requestBody as RequestBody);

    // Set Response
    if (response.success) {
      res.statusCode = 200;
      res.send(JSON.stringify(response));
    } else {
      res.statusCode = 500;
      res.send(JSON.stringify(response));
    }
  });
};
