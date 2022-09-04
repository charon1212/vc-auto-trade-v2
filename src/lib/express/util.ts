import { Request } from "express";

export const getQueryParamString = (request: Request<any, any, any, any, any>, paramName: string) => {
  const queryParam = request.query[paramName];
  if (typeof queryParam === 'string') return queryParam;
  return undefined;
};
