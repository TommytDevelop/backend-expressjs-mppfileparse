const mongoose = require("mongoose");

var uri = "mongodb://localhost:27017/test";

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

const Schema = mongoose.Schema;

let mppCollection = new Schema(
  {
    batch_name: {
      type: String,
    },
    project_name: {
      type: String,
    },
    task_name: {
      type: String,
    },
    task_type: {
      type: Number,
    },
    duration_days: {
      type: String,
    },
    start_date: {
      type: String,
    },
    end_date: {
      type: String,
    },
    predecessor: {
      type: Number,
    },
    level: {
      type: Number,
    },
    notes: {
      type: String,
    },
  },

  { collection: "mpp" }
);

module.exports = mongoose.model("mpp", mppCollection);
