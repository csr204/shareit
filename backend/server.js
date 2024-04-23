const express = require("express");
const cors = require("cors");
const app = express();
const connectdb = require("./config/db");
const path = require("path");
connectdb();
//middleware
// app.use(cors());
require("dotenv").config();
//for parsing json data
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "Content-Type",
    "Authorization"
  );
  next();
});
//template engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
//to avoid mimetype error for(css files)
app.use(express.static(__dirname + "/public"));

//routes
app.use("/api/file", require("./routes/routes"));
app.use("/api/file", require("./routes/routes"));
app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/download"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening port ${PORT}...`);
});
