const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { hashPassword, checkPasswords } = require("@shared/services/password");

const jwtPrivateKey = process.env.JWT_PRIVATE_KEY.replace(/\\n/gm, "\n");
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
const jwtAlgorithm = process.env.JWT_ALGORITHM;

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
      enum: ["basic", "admin", "student", "teacher"],
      default: "basic",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
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

userSchema.methods.checkPassword = async function (suppliedPassword) {
  const isValid = await checkPasswords(this.password, suppliedPassword);
  return isValid;
};

userSchema.methods.generateAuthToken = async function () {
  return new Promise((resolve, reject) => {
    const payload = { id: this._id, role: this.role };

    jwt.sign(
      payload,
      jwtPrivateKey,
      {
        expiresIn: jwtExpiresIn,
        algorithm: jwtAlgorithm,
      },
      (err, token) => {
        if (err) return reject(err);
        else return resolve(token);
      }
    );
  });
};

userSchema.statics.isExistingUser = async function (id) {
  const user = await this.findById(id);
  if (!user) return false;
  return true;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
