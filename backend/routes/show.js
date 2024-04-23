const router = require("express").Router();
const model = require("../models/schema");
router.get("/:uuid", async (req, res) => {
  try {
    const requestedFile = await model.findOne({ uuid: req.params.uuid });
    if (!requestedFile) {
      return res.render("download", { error: "File doesn't exist" });
    }
    return res.render("download", {
      uuid: requestedFile.uuid,
      Filename: requestedFile.filename,
      size: requestedFile.size,
      downloadUrl: `${process.env.BASE_URL}/files/download/${requestedFile.uuid}`,
    });
  } catch (err) {
    return res.render("download", { error: err });
  }
});
module.exports = router;
