import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js"

//https://github.com/Ishaan1103/Backend-Video-streaming-service/blob/main/src/controllers/video.controller.js

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    const video = await Video.find({}).populate("owner", "username email").sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit).exec();

    if (!video) {
        throw new ApiError(404, "No video found")
    }

    return res.status(200).json(new ApiResponse(200, "All videos", video))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if (!title || !description) {
        throw new ApiError(400, "Title and description not found")
    }
    const videoFileLocalPath = req.files?.videofile[0].path;
    console.log(req.files);

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file not found")
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);

    if (!videoFile) {
        throw new ApiError(500, "Error while uploading video file")
    }

    const thumbnailFileLocalPath = req.files?.thumbnail[0].path;

    if (!thumbnailFileLocalPath) {
        throw new ApiError(400, "Thumbnail file not found")
    }

    const thumbnailFile = await uploadOnCloudinary(thumbnailFileLocalPath);

    if (!thumbnailFile) {
        throw new ApiError(500, "Error while uploading thumbnail file")
    }

    const saveVideo = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        duration: videoFile.duration,
        thumbnail: thumbnailFile.url,
        owner: req.user?._id477
    })

    if (!saveVideo) {
        throw new ApiError(500, "Error while saving video")
    }

    return res.status(201).json(new ApiResponse(200, "Video published successfully", saveVideo))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: get video by id
    if (!videoId) {
        throw new ApiError(400, "VideoId not found");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(new ApiResponse(200, { video }, "Video"))
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const { titile, description } = req.body;

    const video = await Video.findById(videoId)

    const { thumbnail } = req.file;



    if (!videoId) {
        throw new ApiError(400, "VideoId not found");
    }
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}