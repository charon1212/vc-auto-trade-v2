import { handleError } from "../../../src/common/error/handleError";
import { spyCommon } from "./spyCommon";

describe('spyCommon', () => {
  it('test1', () => {
    const { spyHandleError } = spyCommon();
    expect(() => handleError({ __filename: 'test1-1', method: 'test1-2' })).toThrow();
    expect(spyHandleError).toBeCalled();
    expect(spyHandleError.mock.calls[0][0].__filename).toBe('test1-1');
    expect(spyHandleError.mock.calls[0][0].method).toBe('test1-2');
  });
});
