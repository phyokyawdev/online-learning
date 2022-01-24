const passport = require("passport");
const auth = require("../auth");
const { createNewObjectId } = require("@shared/services/object-id");
const { NotAuthorizedError } = require("@shared/errors");

describe("auth middleware", () => {
  let user, reqMock, nextMock;

  beforeEach(() => {
    user = { id: createNewObjectId().toHexString(), role: "basic" };
    reqMock = {};
    nextMock = jest.fn();
  });

  // error mock
  const errorPassportJwt = jest.fn((authType, options, callback) => () => {
    callback(new Error("Error occurred."));
  });
  // fail mock
  const failPassportJwt = jest.fn((authType, options, callback) => () => {
    callback(null, false, { message: "Something failed." });
  });
  // success mock
  const successPassportJwt = jest.fn((authType, options, callback) => () => {
    callback(null, user);
  });

  it("should call next with anything if something wrong validating jwt", () => {
    passport.authenticate = errorPassportJwt;
    auth(reqMock, {}, nextMock);
    expect(nextMock).toHaveBeenCalledWith(expect.anything());
  });

  it("should call next with NotAuthorizedError if jwt is invalid", () => {
    passport.authenticate = failPassportJwt;
    auth(reqMock, {}, nextMock);
    expect(nextMock).toHaveBeenCalledWith(expect.any(NotAuthorizedError));
  });

  it("should populate req.user and call next with nothing if jwt is valid", () => {
    passport.authenticate = successPassportJwt;
    auth(reqMock, {}, nextMock);
    expect(reqMock.user).toMatchObject(user);
    expect(nextMock).toHaveBeenCalledWith();
  });
});
