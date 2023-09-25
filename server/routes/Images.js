const { labelDetection } = require("../api/ModelAPI");

exports.getLabels = async (req, res) => {
  const { file } = req;
  const response = { status: 200, data: {}, message: "" };

  if (file) {
    try {
      const result = await labelDetection(file);
      response.data = result;
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
