const express = require("express");
const { ForbiddenError } = require("@shared/errors");

/**
 * allow teacher only middleware
 * @param {express.Request & {user: {role: string}}} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @throws ForbiddenError
 */
function allowTeacher(req, res, next) {
  if (req.user && req.user.role === "teacher") return next();
  throw new ForbiddenError();
}

module.exports = allowTeacher;
