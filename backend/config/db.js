const mongoose = require("mongoose");
require("dotenv").config();
const dbname = "files";
const connectdb = () => {
  try {
    mongoose.connect(`${process.env.MONGO_URI}${dbname}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.once("open", function () {
      console.log("connected");
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports = connectdb;
