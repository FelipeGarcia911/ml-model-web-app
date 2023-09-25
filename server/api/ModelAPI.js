const axios = require("axios");
const FormData = require("form-data");

const API_URL = "https://ml-model-docker-sa51-dev.fl0.io/api/v1/image/labeling";

exports.labelDetection = async (file) => {
  const { buffer, originalname, mimetype } = file;

  let result = null;
  let data = new FormData();

  data.append("image", buffer, {
    filename: originalname,
    contentType: mimetype,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: API_URL,
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };

  try {
    const { status, data } = await axios.request(config);
    if (status === 200) {
      result = data.prediction;
    } else {
      result = "Error processing image";
    }
  } catch (error) {
    console.log("🚀 ~ file: ModelAPI.js:35 ~ exports.labelDetection= ~ error:", error)
  }

  return result;
};
