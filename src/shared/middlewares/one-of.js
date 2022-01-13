/**
 * Return middleware that pass req to next if one of middlewares pass
 * call next with provided error obj if all middlewares failed.
 * @param {*} middlewares - which throw error or call next
 * @param {*} err - error obj to pass to next if all middlewares fail
 * @returns middleware
 *
 *
 * can also use for of loop
 * also need support for async middlewares
 * const AsyncFunction = (async () => {}).constructor;
 * if(f instanceof AsyncFunction === true)
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
  else next(err);
};

module.exports = oneOf;
