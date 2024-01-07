var express = require("express");
var fs = require("fs");
var moment = require("moment");
var { ObjectId } = require("mongoose").Types;
var router = express.Router();
const { regex } = require("../utils/api");
// Get your ClientId and ClientSecret from https://dashboard.aspose.cloud (free registration required).

var mpp_collection = require("../model/dbconnect");
const { json } = require("body-parser");

/* GET GetProjectAllData */
router.get("/GetProjectAllData", async function (req, res, next) {
  const pageSize = parseInt(req.query.pageSize);
  let find_query = {};

  req.query.batch_name
    ? (find_query.batch_name = regex(req.query.batch_name))
    : undefined;

  req.query.project_name
    ? (find_query.project_name = regex(req.query.project_name))
    : undefined;
  req.query.task_name
    ? (find_query.task_name = regex(req.query.task_name))
    : undefined;
  req.query.task_type
    ? (find_query.task_type = parseInt(req.query.task_type))
    : undefined;
  req.query.duration_days
    ? (find_query.duration_days = regex(req.query.duration_days))
    : undefined;
  req.query.start_date
    ? (find_query.start_date = regex(req.query.start_date))
    : undefined;
  req.query.end_date
    ? (find_query.end_date = regex(req.query.end_date))
    : undefined;
  req.query.predecessor
    ? (find_query.predecessor = parseInt(req.query.predecessor))
    : undefined;
  req.query.level ? (find_query.level = parseInt(req.query.level)) : undefined;
  req.query.notes ? (find_query.notes = regex(req.query.notes)) : undefined;

  const sort = JSON.parse(req.query.sort);
  if (Object.keys(sort).length) {
    const sort_name = Object.keys(sort)[0];
    sort[sort_name] = sort[sort_name] + "ing";
  }

  await mpp_collection
    .find(find_query)
    .sort(sort)
    //    .limit(pageSize)
    .then((json) => {
      console.log("Success");
      res.json({
        data: json,
        total: json.length,
        success: true,
        current: parseInt(req.query.current),
        pageSize: parseInt(req.query.pageSize),
      });
    })
    .catch((err) => {
      console.log(err);
      res.statusCode = 400;
      res.json({ success: false });
    });
});

/* POST AddProject*/
router.post("/AddProject", async function (req, res, next) {
  var created = moment().format("YYYYMMDDhhmmssSSS");
  req.body["batch_name"] = created;

  const newProject = new mpp_collection(req.body);
  newProject.save();
  res.json({ success: true });
});

/* OPTIONS AddProject*/
router.options("/AddProject", async function (req, res, next) {});

/* POST UpdateProject*/
router.post("/UpdateProject", async function (req, res, next) {
  const filter = { _id: req.body._id };
  const updateData = {
    ...req.body,
  };

  const data = await mpp_collection.findOneAndUpdate(filter, updateData, {
    new: true,
  });
  res.json({ success: true });
});

/* OPTIONS UpdateProject*/
router.options("/UpdateProject", async function (req, res, next) {});

/* POST DeleteProject*/
router.post("/DeleteProject", async function (req, res, next) {
  const filter = { _id: req.body._id };

  await mpp_collection.deleteOne(filter);
  res.json({ success: true });
});

/* OPTIONS DeleteProject*/
router.options("/DeleteProject", async function (req, res, next) {});
module.exports = router;
