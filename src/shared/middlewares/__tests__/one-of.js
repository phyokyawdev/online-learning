const oneOf = require("../one-of");
const { ForbiddenError } = require("@shared/errors");

describe("one-of middleware", () => {
  let req, next;

  beforeEach(() => {
    req = {};
    next = jest.fn();
  });

  const failMiddleware = (_req, _res, nxt) => {
    nxt(new Error("Failed."));
  };

  const passMiddleware = (r, _res, nxt) => {
    r.user = true;
    nxt();
  };

  const failMiddlewareChain = [
    (_req, _res, nxt) => {
      nxt();
    },
    (_req, _res, nxt) => {
      nxt(new Error("Failed chain."));
    },
  ];

  const passMiddlewareChain = [
    (r, _res, nxt) => {
      r.user = true;
      nxt();
    },
    (r, _res, nxt) => {
      if (!r.user) throw new Error("req wasn't shared in middleware chain");
      nxt();
    },
  ];

  it("should throw or call next with Error if empty array", async () => {
    await global.throwOrPassError(oneOf([]), req, {}, next, Error);
  });

  it("should throw or call next with last error if all failed", async () => {
    const mdw = oneOf([failMiddleware, failMiddleware]);
    await global.throwOrPassError(mdw, req, {}, next, Error);
  });

  it("should throw or call next with provided err if all failed", async () => {
    const mdw = oneOf([failMiddleware], new ForbiddenError());
    await global.throwOrPassError(mdw, req, {}, next, ForbiddenError);
  });

  it("should call next if at least one of the middlewares passed", async () => {
    await oneOf([failMiddleware, passMiddleware])(req, {}, next);
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next if all middlewares passed", async () => {
    await oneOf([passMiddleware, passMiddleware])(req, {}, next);
    expect(next).toHaveBeenCalledWith();
  });

  it("should work for failed chain of middlewares", async () => {
    const mdw = oneOf([failMiddlewareChain, failMiddleware]);
    await global.throwOrPassError(mdw, req, {}, next, Error);
  });

  it("should work for pass chain of middlewares", async () => {
    await oneOf([passMiddlewareChain, failMiddleware])(req, {}, next);
    expect(next).toHaveBeenCalledWith();
  });

  it("should not mutate provided request", async () => {
    await oneOf([passMiddleware])(req, {}, next);
    expect(req).toMatchObject({});
  });
});
