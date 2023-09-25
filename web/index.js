const API_URL = "/labeling";

let SELECTED_IMAGE = "";

const makePostRequest = async (url, payload) => {
  const config = {
    url: url,
    type: "POST",
    data: payload,
    cache: false,
    contentType: false,
    processData: false,
  };
  const response = await $.ajax(config);

  return response;
};

const handleOnSuccess = (data) => {
  const { message, label, probability } = data;
  const payload = `<span class="badge rounded-pill bg-secondary px-5 py-3">${message}</span>`;
  showResults(payload);
};

const showResults = (labels) => {
  $("#results").html(labels);
  $("#results").show();
};

const cleanResults = () => {
  $("#results").html("");
  $("#results").hide();
};

const handleOnError = (message = "") => {
  alert(`Error processing image: ${message}`);
};

const getImageFile = async (imageURL) => {
  const file = await fetch(imageURL);

  return file.blob();
};
const analizeImage = async (file) => {
  setIsLoading(true);
  cleanResults();

  try {
    const formData = new FormData();
    formData.append("image", file);

    const { status, data, message } = await makePostRequest(API_URL, formData);
    if (status === 200) {
      handleOnSuccess(data);
    } else {
      handleOnError(message);
    }
  } catch (error) {
    handleOnError(error);
  }
  setIsLoading(false);
};

const setIsLoading = (isLoading) => {
  const label = isLoading ? '<div class="spinner-grow text-warning" role="status"><span class="visually-hidden">Loading...</span></div>' : "Analizar";
  $(".submit-button").html(label);
};

$(document).ready(() => {
  const file_input = $("#file_input");
  const filename = $("#filename");
  const delete_file_btn = $("#delete_file");

  file_input.change(function () {
    const selectedFile = file_input[0].files[0];
    if (selectedFile) {
      filename.text(selectedFile.name);
      delete_file_btn.show();
    } else {
      filename.text("");
      delete_file_btn.hide();
    }
  });

  delete_file_btn.click(function () {
    file_input.val(""); // Borra la selección del archivo
    filename.text("");
    delete_file_btn.hide();
  });

  $("#form-1").submit(async function (event) {
    event.preventDefault();

    if (SELECTED_IMAGE) {
      const file = await getImageFile(SELECTED_IMAGE);
      analizeImage(file);
    } else {
      handleOnError("No image selected");
    }

    return false;
  });

  $("#form-2").submit(async function (event) {
    event.preventDefault();

    const file = $("#file_input")[0].files[0]
    if (file) {
      analizeImage(file);
    } else {
      handleOnError("No image selected");
    }

    return false;
  });

  $(".card").click(function () {
    $(".card").removeClass("hovered");
    $(this).addClass("hovered");

    SELECTED_IMAGE = $(this).find("img").attr("src");
  });
});
