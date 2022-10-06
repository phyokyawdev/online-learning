const cloudinary = require("cloudinary").v2;
const { CLOUDINARY_API_SECRET, CLOUDINARY_HOST, CLOUDINARY_API_KEY } =
  process.env;

const signUploadWidget = (options) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      ...options,
    },
    CLOUDINARY_API_SECRET
  );

  return { timestamp, signature };
};

const createSignedUpload = (folderName) => {
  const sig = signUploadWidget({ folderName });

  return {
    presignedUrl: `https://api.cloudinary.com/v1_1/${CLOUDINARY_HOST}/image/upload`,
    api_key: CLOUDINARY_API_KEY,
    folder: folderName,
    timestamp: sig.timestamp,
    signature: sig.signature,
  };
};

module.exports = { signUploadWidget, createSignedUpload };
