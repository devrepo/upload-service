const archiver = require("archiver");
const fs = require("fs");
const path = require("path");
const writeFolder = "documents";
const cmd = require("node-cmd");
const async = require("async");

let db = 10;
exports.setDB = function (database) {
  db = database;
};

/**
 * API to list all the documents with the given pagination rules like:
 * page (page number) and limit (page size)
 * @param {Request} req
 * @param {Response} res
 */
exports.list = async function (req, res) {
  let page = parseInt(req.query.p);
  let limit = parseInt(req.query.l);
  limit = limit || 1;
  page = page < 0 ? 0 : page;
  const filesCollection = db.collection("files");
  filesCollection.countDocuments().then((totalFiles) => {
    let pageCount = Math.ceil(totalFiles / limit);
    let lastPage = false;
    if (page >= pageCount - 1) {
      page = pageCount - 1;
      lastPage = true;
    }
    const skip = page * limit;
    filesCollection
      .find()
      .limit(limit)
      .skip(skip)
      .toArray((err, records) => {
        if (err) return res.status(500).send("Some error happened");
        res.send({ data: records, success: true, lastPage: lastPage });
      });
  });
};

/**
 * Function supposed to be used to download the multiple files as an archive
 * @param {Request} req : Request need to have each file contain the following properties
 * path: file path local to the server
 * name: file name
 * ext: file extension
 * @param {Response} res: Response with
 */
exports.download = async function (req, res) {
  const { files } = req.body;
  const archive = archiver("zip");
  res.attachment("download.zip");
  archive.pipe(res);
  zipFiles(archive, files, (archived) => {
    archived.finalize();
  });
};

async function zipFiles(archive, files, cb) {
  const asyncArray = [];
  files.map((file) => {
    asyncArray.push((next) => {
      fs.readFile(file.path, (err, data) => {
        if (err) {
          console.log("err ocurred", err);
        } else {
          archive.append(data, {
            name: `${file.name}${new Date().getTime()}${file.ext}`,
          });
          next(null);
        }
      });
    });
  });
  async.parallel(asyncArray, (err, result) => {
    if (err) return err;
    return cb(archive);
  });
}
