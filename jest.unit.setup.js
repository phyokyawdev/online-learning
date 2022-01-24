/**
 * Middleware unit test helper
 * @param {*} middleware
 * @param {*} reqMock
 * @param {*} resMock
 * @param {*} nextMock
 * @param {Error} errType error type to call next with
 */
async function testMiddleware(middleware, reqMock, resMock, nextMock, errType) {
  try {
    await expect(
      async () => await middleware(reqMock, resMock, nextMock)
    ).rejects.toThrow(errType);
  } catch (error) {
    expect(nextMock).toHaveBeenCalledWith(expect.any(errType));
  }
}

global.testMiddleware = testMiddleware;
global.throwOrPassError = testMiddleware;
