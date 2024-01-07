var express = require("express");
var fs = require("fs");
var router = express.Router();
const { execFile, exec } = require("child_process");

// Get your ClientId and ClientSecret from https://dashboard.aspose.cloud (free registration required).

var mpp_collection = require("../model/dbconnect");
var { getListDirectory, getListFiles } = require("../utils/api");
const uploadPath = "UploadFiles";
fs.access(uploadPath, (error) => {
  if (error) {
    fs.mkdir(uploadPath, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("UploadFile Directory created successfully !!");
      }
    });
  } else {
    console.log("UploadFile Directory already exists !!");
  }
});

// predicate the router with a check and bail out when needed
router.use((req, res, next) => {
  console.log("Middleware");
  next();
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* OPTIONS MppFileUpload */
router.options("/MppFileUpload", function (req, res, next) {
  res.send("OPTIONS MppFileUploada");
});

/* POST MppFileUpload */

router.post("/MppFileUpload", function (req, res, next) {
  console.log(req.body);
  const projectname = req.body.projectname;
  if (projectname) {
    const projectPath = uploadPath + "\\" + projectname;

    fs.access(projectPath, (error) => {
      if (error) {
        fs.mkdir(projectPath, (error) => {
          if (error) {
            console.log(error);
            res.json({
              error: "Please enter the project name correctly",
              uploaded: false,
            });
          } else {
            console.log("New Directory created successfully !!");
            req.files.files.forEach(async (file) => {
              let uploadFilePath =
                process.cwd() +
                "\\" +
                projectPath +
                "\\" +
                file.name.split("/")[1];
              fs.copyFile(file.path, uploadFilePath, (err) => {
                fs.unlink(file.path, (err) => {});
                if (err) console.log(err);
              });
            });
            res.json({ uploaded: true });
          }
        });
      } else {
        console.log("Given Directory already exists !!");
        res.json({ error: "Project name already exists !!", uploaded: false });
      }
    });
  }
});

/* POST Update SQL */
router.post("/UpdateSQL", async function (req, res, next) {
  const child = await exec(
    '"' +
      process.cwd() +
      '\\MppFileParse\\MppFileParse.exe" "' +
      process.cwd() +
      "\\" +
      uploadPath +
      '"',
    async (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      const json = JSON.parse(stdout);
      await mpp_collection
        .deleteMany({})
        .then(() => console.log("Data Deleted"))
        .catch((error) => console.log(error));

      await mpp_collection
        .insertMany(json)
        .then(() => {
          console.log("Success");
          res.json({ success: true });
        })
        .catch((err) => {
          console.log(err);
          res.statusCode = 400;
          res.json({ success: false });
        });
    }
  );
});

module.exports = router;
