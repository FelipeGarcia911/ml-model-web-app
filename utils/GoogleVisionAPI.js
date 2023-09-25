const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient();

exports.labelDetection = async (imageURL) => {
  const [result] = await client.labelDetection(imageURL);
  const labels = result.labelAnnotations;

  return labels;
};
