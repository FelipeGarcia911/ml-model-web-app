const API_URL = "/vision/labels";

const makePostRequest = async (url, payload) => {
  const config = { url: url, type: "POST", data: payload };
  const response = await $.ajax(config);
  return response;
};

const handleOnSuccess = (imageURL, data = {}) => {
  const { labels = [] } = data;
  const payload = labels.reduce((acc, label) => {
    const { description, score } = label;
    return `${acc}<span class="badge rounded-pill bg-primary">${description}</span>    `;
  }, "");
  showResults(payload, imageURL);
};

const showResults = (labels, imageURL) => {
  $("#labels").html(labels);
  $("#imageToAnalize").attr("src", imageURL);
  $("#results").show();
};

const cleanResults = () => {
  $("#labels").html("");
  $("#imageToAnalize").attr("src", "");
  $("#results").hide();
};

const handleOnError = (message = "") => {
  alert(`Error processing image: ${message}`);
};

const analizeImage = async (imageURL) => {
  setIsLoading(true);
  cleanResults();

  try {
    const payload = { imageURL };
    const { status, data, message } = await makePostRequest(API_URL, payload);
    if (status === 200) {
      handleOnSuccess(imageURL, data);
    } else {
      handleOnError(message);
    }
  } catch (error) {
    handleOnError(error);
  }
  setIsLoading(false);
};

const setIsLoading = (isLoading) => {
  const label = isLoading
    ? '<div class="spinner-grow text-warning" role="status"><span class="visually-hidden">Loading...</span></div>'
    : "Analizar";
  $("#button").html(label);
};

$(document).ready(() => {
  $("#form").submit(function (event) {
    event.preventDefault();

    const imageURL = $("#imageURL").val();
    analizeImage(imageURL);
  });
});
