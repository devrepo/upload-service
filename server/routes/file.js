const fs = require("fs").promises;
const path = require("path");
const writeFolder = "documents";
const cmd = require("node-cmd");
const async = require("async");
const fileModel = require("../models/file");
let db = 10,
  io;
exports.setDB = function (database) {
  db = database;
};
exports.setIO = function (ioSocket) {
  io = ioSocket;
};

async function readFile(path) {
  const fileData = await fs.readFile(path);
  return fileData;
}
async function writeData(filePath, data) {
  return await fs.writeFile(filePath, data);
}

async function insertRecords(filesArray, fields) {
  const { description, user } = fields;
  const filesRecord = [];
  filesArray.forEach((file) => {
    const { originalname, size, mimetype, filename } = file;
    const model = fileModel.file();
    model.filename = originalname;
    model.path = path.join(writeFolder, filename + "_" + originalname);
    model.size = size;
    model.mimetype = mimetype;
    model.description = description;
    model.user = user;
    model.status = 0;
    model.uploadedAt = new Date().getTime();
    filesRecord.push(model);
  });
  const filesCollection = db.collection("files");
  return await filesCollection.insertMany(filesRecord);
}

async function updateStatus(path, status) {
  const filesCollection = db.collection("files");
  return await filesCollection.updateOne(
    { path: { $eq: path } },
    { $set: { status: status } }
  );
}
async function processUpload(file) {
  return new Promise(async (resolve, reject) => {
    const { originalname, size, mimetype, filename, path: uploadedPath } = file;
    const fileData = await readFile(uploadedPath);
    const relativePath = path.join(writeFolder, filename + "_" + originalname);
    const filePath = path.join(__dirname, "..", "..", relativePath);
    try {
      await writeData(filePath, fileData);
    } catch (e) {
      await updateStatus(relativePath, 2);
      return reject("Error" + e);
    }
    await updateStatus(relativePath, 1);
    resolve();
  });
}
exports.upload = async function (req, res) {
  const filesArray = req.files;
  const fields = req.body;
  if (!filesArray) {
    return res.status(500).send("Some error happened");
  }
  io.sockets.emit("upload_started", {
    user: fields.user,
    files: filesArray.length,
  });
  await insertRecords(filesArray, fields);
  const len = filesArray.length,
    processes = [];
  for (let i = 0; i < len; i++) {
    const file = filesArray[i];
    processes.push(processUpload(file));
  }
  try {
    await Promise.all(processes);
    cmd.run("rm -rf ./uploads/*");
    return res.send({
      code: 200,
      success: true,
    });
  } catch (err) {
    return res.send({
      code: 500,
      success: true,
    });
  }
};
