const express = require("express");
const router = express.Router();

const {
  validateRequest,
  oneOf,
  allowCourseOwner,
  allowCourseEnrolled,
} = require("@shared/middlewares");
const {
  AssignmentAnswer,
  createRules,
  readRules,
  updateRules,
} = require("@models/assignment_answer");
const {
  ConflictError,
  NotFoundError,
  ForbiddenError,
} = require("@shared/errors");

const allowSubmittedStudent = [
  allowCourseEnrolled,
  async (req, _res, next) => {
    const { currentCourseStudent, currentAssignmentQuestion } = req;
    const isExisting = await AssignmentAnswer.isExisting(
      currentCourseStudent.id,
      currentAssignmentQuestion.id
    );
    if (!isExisting)
      throw new ForbiddenError("Only answer submitted student can access.");
    next();
  },
];

const allowOwnerOrSubmittedStudent = oneOf([
  allowCourseOwner,
  allowSubmittedStudent,
]);

/**
 * req.answer will be available in
 * route handlers with id param.
 */
router.param("id", async (req, _res, next, id) => {
  const answer = await AssignmentAnswer.findByIdString(id);
  if (!answer) throw new NotFoundError("Assignment answer not exist.");
  req.answer = answer;
  next();
});

router.post(
  "/",
  allowCourseEnrolled,
  validateRequest(createRules),
  async (req, res) => {
    const { currentCourseStudent, currentAssignmentQuestion, body } = req;
    const studentId = currentCourseStudent.id;
    const questionId = currentAssignmentQuestion.id;

    const isExisting = await AssignmentAnswer.isExisting(studentId, questionId);
    if (isExisting) throw new ConflictError("Already submitted.");

    const answer = await AssignmentAnswer.create(body, studentId, questionId);
    res.status(201).send(answer);
  }
);

router.get(
  "/",
  allowOwnerOrSubmittedStudent,
  validateRequest(readRules),
  async (req, res) => {
    const { query, currentAssignmentQuestion } = req;
    const answers = await AssignmentAnswer.findByQuery(
      query,
      currentAssignmentQuestion.id
    );
    res.send(answers);
  }
);

router.get("/:id", allowOwnerOrSubmittedStudent, async (req, res) => {
  const { answer } = req;
  res.send(answer);
});

router.patch(
  "/:id",
  allowCourseOwner,
  validateRequest(updateRules),
  async (req, res) => {
    const { answer, body } = req;
    await answer.updateBody(body);
    res.send(answer);
  }
);

module.exports = router;
