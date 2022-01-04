const express = require("express");
const { ForbiddenError } = require("@shared/errors");

/**
 * allow admin only middleware
 * @param {express.Request & {user: {role: string}}} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
function allowAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") return next();
  throw new ForbiddenError();
}

module.exports = allowAdmin;
