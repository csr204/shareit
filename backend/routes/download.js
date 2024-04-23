const router = require("express").Router();
const model = require("../models/schema");

router.get("/:uuid", async (req, res) => {
  try {
    const requestedFile = await model.findOne({ uuid: req.params.uuid });
    const filesPath = `${requestedFile.path}/${requestedFile.filename}`;
    res.download(filesPath);
  } catch (error) {
    res.send(error);
  }
});
module.exports = router;
