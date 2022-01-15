const express = require("express");

/**
 * Executes middlewares sequentially.
 * Pass req to next handler if one of the middlewares is passed.
 *
 *
 * Upon failure of all middlewares, call next with provided err
 * or error thrown by the last middleware.
 * @param {[express.RequestHandler]} middlewares
 * @param {*} [err]
 * @returns {express.RequestHandler} middleware
 */
const oneOf = (middlewares, err) => async (req, res, next) => {
  const errors = await middlewares.reduce(async (acc, elt) => {
    let accumulator = await acc;
    try {
      await elt(req, res, () => {});
    } catch (error) {
      accumulator.push(error);
    }
    return accumulator;
  }, Promise.resolve([]));

  if (errors.length < middlewares.length) next();
  else if (!err) next(errors[errors.length - 1]);
  else next(err);
};

module.exports = oneOf;
