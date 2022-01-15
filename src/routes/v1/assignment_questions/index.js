const express = require("express");
const router = express.Router();

const {
  allowCourseOwner,
  validateRequest,
  allowCourseStudent,
  oneOf,
} = require("@shared/middlewares");
const {
  AssignmentQuestion,
  createRules,
} = require("@models/assignment_question");
const { ForbiddenError, NotFoundError } = require("@shared/errors");

/** Custom middleware */
const allowStudentOrOwner = oneOf(
  [allowCourseStudent, allowCourseOwner],
  new ForbiddenError("only course student or owner is allowed.")
);

/**
 * req.question will be available in
 * route handlers with id param.
 */
router.param("id", async (req, _res, next, id) => {
  const question = await AssignmentQuestion.findByIdString(id);
  if (!question) throw new NotFoundError("Assignment question not exist.");

  req.question = question;
  next();
});

router.post(
  "/",
  allowCourseOwner,
  validateRequest(createRules),
  async (req, res) => {
    const { body, currentCourse } = req;
    const question = await AssignmentQuestion.create(body, currentCourse.id);
    res.status(201).send(question);
  }
);

router.get("/", allowStudentOrOwner, async (req, res) => {
  const { query, currentCourse } = req;
  const questions = await AssignmentQuestion.findByQuery(
    query,
    currentCourse.id
  );
  res.send(questions);
});

router.get("/:id", allowStudentOrOwner, async (req, res) => {
  const { question } = req;
  res.send(question);
});

router.put(
  "/:id",
  allowCourseOwner,
  validateRequest(createRules),
  async (req, res) => {
    const { question, body } = req;
    await question.updateBody(body);
    res.send(question);
  }
);

router.delete("/:id", allowCourseOwner, async (req, res) => {
  const { question } = req;
  await question.remove();
  res.status(204).send();
});

module.exports = router;
