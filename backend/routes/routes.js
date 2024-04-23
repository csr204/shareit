const router = require("express").Router();
const path = require("path");
const fileModel = require("../models/schema");
const uploadPath = path.resolve(__dirname, "../files");

//uuid(for version 4 apis)
const { v4: uuid4 } = require("uuid");
//file model(db)
const File = require("../models/schema");
require("dotenv").config();
//multer code
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //first parameter given to callback(cb) is error(here there is no error so null)
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    let fileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});
const upload = multer({
  storage: storage,
  limits: { fieldSize: 100000 * 100 },
}).single("myfile");

//for checking
router.get("/", (req, res) => {
  res.send("Hello");
});

router.post("/", (req, res) => {
  //store file
  upload(req, res, async function (err) {
    //validate req
    try {
      if (!req.file) {
        return res.json({ error: "All fields are required" });
      }
      if (err) {
        return res.status(500).send({ error: err.message });
      }
      //if there is no error then store the Details of file in db
      const file = new File({
        filename: req.file.filename,
        size: req.file.size,
        path: uploadPath,
        uuid: uuid4(),
      });

      const response = await file.save();
      // send response(link)
      res
        .status(200)
        .json({ url: `${process.env.BASE_URL}/files/${response.uuid}` });
    } catch (error) {
      console.error(error); // Log any unexpected errors
      res.status(500).json({ error: "Internal server error" });
    }
  });
});

router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;
  console.log(req.body);
  if (!uuid || !emailFrom || !emailTo) {
    return res.json({ message: "All fields are required" });
  }
  const requestedFile = await fileModel.findOne({ uuid: uuid });
  if (requestedFile.sender === emailFrom) {
    return res.json({ message: "File already sent" });
  }
  requestedFile.sender = emailFrom;
  requestedFile.receiver = emailTo;
  const response = await requestedFile.save();
  //send mail and for sending mails we need nodemailer package
  const sendMail = require("../services/mailService");
  const template = require("../services/emailTemplate")({
    emailFrom: emailFrom,
    downloadLink: `${process.env.BASE_URL}/files/download/${requestedFile.uuid}`,
    size: `${parseInt(requestedFile.size / 1000)} KB`,
    expires: `24 hours`,
  });
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "ShareIt easy transfering of files",
    text: `${emailFrom} sent a file to you`,
    html: template,
  });
  res.status(200).send({ message: "successfully sent" });
});
module.exports = router;
