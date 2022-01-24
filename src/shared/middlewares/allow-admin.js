const express = require("express");
const { ForbiddenError } = require("@shared/errors");

/**
 * allow admin only middleware
 * @param {express.Request & {user: {role: string}}} req
 * @param {express.Response} _res
 * @param {express.NextFunction} next
 * @throws Error || ForbiddenError
 */
function allowAdmin(req, _res, next) {
  const { user } = req;
  if (!user) throw new Error("Use this middleware after auth.");

  if (user.role !== "admin") throw new ForbiddenError("Only admin is allowed.");

  next();
}

module.exports = allowAdmin;
