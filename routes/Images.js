const { labelDetection } = require("../utils/GoogleVisionAPI");

exports.getLabels = async (req, res) => {
  const { imageURL } = req.body;
  const response = { status: 200, data: { imageURL }, message: "" };

  if (imageURL) {
    try {
      const labels = await labelDetection(imageURL);
      response.data.labels = labels;
    } catch (error) {
      response.status = 400;
      response.message = `Error processing image ${error}`;
    }
  } else {
    response.status = 400;
    response.message = "Invalid Image URL";
  }

  return res.status(response.status).type("json").send(response);
};
