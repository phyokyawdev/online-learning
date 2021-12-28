function checkEnv(...arr) {
  arr.forEach((element) => {
    if (!process.env[element]) {
      throw new Error(`process.env.${element} must be defined`);
    }
  });
}

module.exports = checkEnv;
