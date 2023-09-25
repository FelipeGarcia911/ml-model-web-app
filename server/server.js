require("isomorphic-fetch");

const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require('path');
const multer = require('multer');

const port = parseInt(process.env.PORT, 10) || 3000;
const router = express.Router();
const app = express();
dotenv.config();

// ROUTES
const ImageRoutes = require("./routes/Images");

// CONFIG APP
app.use(express.static(__dirname + '/../web'));
app.use(bodyParser.json());
app.use(
  bodyParser.raw({
    type: "application/json",
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

/**  SERVER ROUTES **/

// FRONTEND ROUTES
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname+'/../web/index.html'));
});

/** BACKEND ROUTES **/
router.post("/labeling", upload.single('image'), ImageRoutes.getLabels);

app.use("/", router);

// Serve static assets
app.use('/assets', express.static('assets'));

/**  START SERVER **/
app.listen(port, () => {
  console.log(`Custom ML Model API Demo Running at http://localhost:${port}`);
});
