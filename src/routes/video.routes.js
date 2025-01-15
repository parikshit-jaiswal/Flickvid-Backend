import { Router } from "express";
import { upload } from './../middlewares/multer.middleware.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllVideos, getVideoById, publishAVideo } from '../controllers/video.controller.js'

const router = Router();

router.route("/all").get(getAllVideos);
router.route("/publish").post(verifyJWT,
    upload.fields([
        {
            name: "videofile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },

    ]),
    publishAVideo
);
router.route("/:videoId").get(getVideoById);

export default router;
