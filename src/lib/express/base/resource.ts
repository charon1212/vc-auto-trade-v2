import { Request, Response } from "express";
import { app } from "../app";
import { createFailureResponse, ExpressResponse } from "./response";

export type HTTPMethod = 'GET' | 'POST' | 'DELETE';
export type ExpressResourceArgs<Method extends HTTPMethod, RequestParam, RequestBody, ResponseData> = Method extends 'POST' ?
  {
    method: Method,
    url: string,
    handler: (requestParam: RequestParam, requestBody: RequestBody) => Promise<ExpressResponse<ResponseData>>,
    paramGuard: (param: any) => string[],
    bodyGuard: (body: any) => string[],
  } : {
    method: Method,
    url: string,
    handler: (requestParam: RequestParam) => Promise<ExpressResponse<ResponseData>>,
    paramGuard: (param: any) => string[],
    bodyGuard?: never,
  };
export const expressResource = <Method extends HTTPMethod, RequestParam = never, RequestBody = never, ResponseData = never>(args: ExpressResourceArgs<Method, RequestParam, RequestBody, ResponseData>) => {
  const { method, url, paramGuard, bodyGuard, handler } = args;

  const handle = async (req: Request, res: Response) => {
    const param = req.query as any;
    const paramGuardResult = paramGuard(param);
    const body = req.body as any;
    const bodyGuardResult = bodyGuard ? bodyGuard(body) : [];
    const validationErrors = [...paramGuardResult, ...bodyGuardResult];
    if (validationErrors.length !== 0) {
      res.statusCode = 400;
      res.send(JSON.stringify(createFailureResponse(validationErrors)));
      return;
    }

    const response = await handler(param as RequestParam, body as RequestBody);

    res.statusCode = response.success ? 200 : 500;
    res.send(JSON.stringify(response));
  };

  if (method === 'GET') return app.get(url, handle);
  if (method === 'POST') return app.post(url, handle);
  if (method === 'DELETE') return app.delete(url, handle);
  const _: never = method;
};
