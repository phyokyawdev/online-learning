const mongoose = require("mongoose");
const _ = require("lodash");
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
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 30,
    },
    googleId: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      minlength: 8,
      maxlength: 1024,
    },
    role: {
      type: String,
      enum: ["basic", "admin", "teacher"],
      default: "basic",
    },
    userinfo: {
      profile_link: String,
      headline: String,
      bio: String,
      socials: [String],
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
    username: this.username,
    googleId: this.googleId,
    email: this.email,
    role: this.role,
    userinfo: this.userinfo,
  };
  const token = await generateAuthToken(payload);
  return token;
};

userSchema.methods.updateUserInfo = async function (
  profile_link,
  headline,
  bio,
  socials
) {
  this.userinfo = { profile_link, headline, bio, socials };
  await this.save();
  return this;
};

userSchema.methods.updateUserRole = async function (body) {
  const { role } = body;
  this.role = role;
  await this.save();
  return this;
};

/** Static methods */
userSchema.statics.create = async function (body) {
  const { username, email, password } = body;
  let user = new this({ username, email, password });
  user = await user.save();
  return user;
};

userSchema.statics.createWithGoogle = async function (
  username,
  email,
  googleId
) {
  let user = new this({ username, email, googleId });
  user = await user.save();
  return user;
};

userSchema.statics.findByIdString = async function (id) {
  if (!mongoose.isValidObjectId(id)) return false;
  const user = await this.findById(id);
  return user;
};

userSchema.statics.findByQuery = async function (query) {
  const { offset, limit } = query;
  const users = await this.find({}).skip(offset).limit(limit);
  return users;
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
