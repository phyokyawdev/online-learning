const mongoose = require("mongoose");
const { oneOf, body, query } = require("express-validator");
const { hashPassword, checkPasswords } = require("@shared/services/password");
const { generateAuthToken } = require("@shared/services/auth-token");

/**
 * User
 * ====
 * username
 * email
 * password
 * role
 *
 * user_courses
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 30,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024,
    },
    role: {
      type: String,
      enum: ["basic", "admin", "teacher"],
      default: "basic",
    },
    user_courses: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "UserCourse",
    },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await hashPassword(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

/** Instance methods */
userSchema.methods.checkPassword = async function (suppliedPassword) {
  const isValid = await checkPasswords(this.password, suppliedPassword);
  return isValid;
};

userSchema.methods.generateAuthToken = async function () {
  const payload = {
    id: this._id,
    role: this.role,
    user_courses: this.user_courses,
  };
  const token = await generateAuthToken(payload);
  return token;
};

/** Static methods */
userSchema.statics.isExistingUser = async function (id) {
  const user = await this.findById(id);
  if (!user) return false;
  return true;
};

const User = mongoose.model("User", userSchema);

/** Request validation rules */
const signupRules = [
  body("username").isLength({ min: 5, max: 30 }),
  body("email").isEmail(),
  body("password").isLength({ min: 8, max: 1024 }),
];

const loginRules = [
  oneOf([
    body("username").isLength({ min: 5, max: 30 }),
    body("email").isEmail(),
  ]),
  body("password").isLength({ min: 8, max: 1024 }),
];

const readRules = [
  query("offset").customSanitizer(parseInt).default(0),
  query("limit").customSanitizer(parseInt).default(10),
];

const updateRules = [body("role").trim().isIn(["basic", "teacher"])];

/** Custom validators */
const teacherValidator = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error("Teacher not exist.");
  if (user.role !== "teacher") throw new Error("Teacher is invalid");
  return true;
};

module.exports = {
  User,
  signupRules,
  loginRules,
  readRules,
  updateRules,
  teacherValidator,
};
