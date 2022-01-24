const express = require("express");
const { CourseStudent } = require("@models/couse_student");
const { ForbiddenError } = require("@shared/errors");

/**
 * Attach req.currentCourseStudent if current user is
 * valid enrolled user to course.
 * @param {express.Request & {user} & {currentCourse}} req
 * @param {express.Response} _res
 * @param {express.NextFunction} next
 * @throws Error || ForbiddenError
 */
async function allowCourseEnrolled(req, _res, next) {
  const { user, currentCourse } = req;
  if (!user) throw new Error("Use this middleware after auth.");

  if (!currentCourse)
    throw new Error("Use this middleware in routes with courseId param.");

  const student = await CourseStudent.findByUserAndCourse(
    user.id,
    currentCourse.id
  );
  if (!student) throw new ForbiddenError("Only course student is allowed.");

  req.currentCourseStudent = student;
  next();
}

module.exports = allowCourseEnrolled;
