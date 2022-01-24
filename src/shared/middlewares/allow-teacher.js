const express = require("express");
const { ForbiddenError } = require("@shared/errors");

/**
 * allow teacher only middleware
 * @param {express.Request & {user: {role: string}}} req
 * @param {express.Response} _res
 * @param {express.NextFunction} next
 * @throws Error || ForbiddenError
 */
function allowTeacher(req, _res, next) {
  const { user } = req;
  if (!user) throw new Error("Use this middleware after auth.");

  if (user.role !== "teacher")
    throw new ForbiddenError("Only teacher is allowed.");

  next();
}

module.exports = allowTeacher;
