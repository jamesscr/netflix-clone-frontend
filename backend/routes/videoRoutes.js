const express = require("express");
const router = express.Router();
const videoController = require("../Controllers/videoController");

router.get("/videos", videoController.getAllVideos);
router.get("/latest-videos", videoController.getLatestVideos);
router.post("/add", videoController.addVideo);
router.patch("/video/:id", videoController.updateVideo);
router.delete("/video/:id", videoController.deleteVideo);
router.get("/video/:id", videoController.getVideoById);

module.exports = router;
