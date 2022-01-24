/**
 * Pass request to next handler if at least
 * one of the middlewares is not failed.
 *
 * Error thrown by last middleware will be
 * used to call next if err is not provided.
 *
 * Request won't be modified.
 *
 * @param {Array} middlewares middleware or chain of middlewares
 * @param {*} [err] err obj to call with next
 * @returns middleware
 */
const oneOf = (middlewares, err) => async (req, _res, next) => {
  if (middlewares.length === 0) throw new Error("Empty middleware array.");
  const reqCpy = { ...req };

  const errors = [];
  for (const middleware of middlewares) {
    try {
      await executeMiddleware(middleware, reqCpy);
    } catch (error) {
      errors.push(error);
    }
  }

  if (errors.length < middlewares.length) next();
  else if (!err) next(errors[errors.length - 1]);
  else next(err);
};

async function executeMiddleware(middleware, request) {
  if (Array.isArray(middleware)) {
    await executeMiddlewareChain(middleware, request);
  } else {
    await middleware(request, {}, nextFun);
  }
}

async function executeMiddlewareChain(middlewareChain, request) {
  for (const middleware of middlewareChain) {
    await middleware(request, {}, nextFun);
  }
}

// Throw if next is called with error.
function nextFun(err) {
  if (err) throw err;
}

module.exports = oneOf;
