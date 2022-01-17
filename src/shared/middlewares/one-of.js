const express = require("express");

/**
 * Pass request to next handler if one of the middlewares didn't throw error.
 * Error thrown by last middleware will be used to call next if err is not provided.
 * request won't be modified.
 * @param {Array.<express.RequestHandler>} middlewares [middleware or chain of middlewares]
 * @param {*} [err] err obj to call with next
 * @returns middleware
 */
const oneOf = (middlewares, err) => async (req, _res, next) => {
  const errors = await middlewares.reduce(async (acc, elt) => {
    const accumulator = await acc;
    try {
      if (Array.isArray(elt)) {
        await executeMiddlewareChain(req, elt);
      } else {
        await elt(req, {}, () => {});
      }
    } catch (error) {
      accumulator.push(error);
    }
    return accumulator;
  }, Promise.resolve([]));

  if (errors.length < middlewares.length) next();
  else if (!err) next(errors[errors.length - 1]);
  else next(err);
};

async function executeMiddlewareChain(req, elt) {
  let sharedRequest = req;
  await elt.reduce(async (prev, curr) => {
    const sharedReq = await prev;
    await curr(sharedReq, {}, () => {});
    return sharedReq;
  }, Promise.resolve(sharedRequest));
}

module.exports = oneOf;
