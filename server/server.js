import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");

import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import sslRedirect from "heroku-ssl-redirect";
//import CssBaseline from "@material-ui/core/CssBaseline";
//import { ThemeProvider } from "@material-ui/core/styles";
//import theme from "../src/app/theme";

//import App from "../src/app/app";

const MongoClient = require("mongodb").MongoClient;
let config = require("./env.json")[process.env.NODE_ENV];
let db;
const multer = require("multer");
const multerupload = multer({ dest: "uploads/" });
const file = require("./routes/file");
const documents = require("./routes/documents");
var cors = require("cors");

let PORT = process.env.PORT;
if (PORT == null || PORT == "") {
  PORT = 8000;
}
let IOPORT = process.env.IOPORT;
if (IOPORT == null || IOPORT == "") {
  IOPORT = 8001;
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const router = express.Router();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000,
  })
);
app.use(cors());
//app.use("^/$", (req, res, next) => {
/*fs.readFile(path.resolve("./build/index.html"), "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Some error happened");
    }
    const context = {};
    const html = ReactDOMServer.renderToString(
      <React.StrictMode>
        <StaticRouter location={req.url} context={context}>
          <ThemeProvider theme={theme}>
            <CssBaseline>
              <App />
            </CssBaseline>
          </ThemeProvider>
        </StaticRouter>
      </React.StrictMode>
    );
    if (context.url) {
      return res.status(301, contect.url);
    }
    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
    );
  });*/
//return res.status(500).send("Some error happened");
//});
//console.log("path", path.resolve(__dirname, "..", "documents"));
app.use("/", express.static(path.resolve(__dirname, "..", "build")));
app.use(
  "/documents",
  express.static(path.resolve(__dirname, "..", "documents"))
);
app.use(sslRedirect());
app.use(morgan("combined"));

//route to handle file printing and listing
router.post("/upload", multerupload.any(), file.upload);
router.get("/list", documents.list);
router.post("/download", documents.download);
app.use("/api", router);

io.on("connection", (client) => {
  file.setIO(io);
});
MongoClient.connect(config.dbConnectionString, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db("uploader");
    file.setDB(db);
    documents.setDB(db);
    io.listen(IOPORT);
    app.listen(PORT, () => {
      console.log(`App launched on ${PORT}`);
    });
  })
  .catch((error) => console.error(error));
