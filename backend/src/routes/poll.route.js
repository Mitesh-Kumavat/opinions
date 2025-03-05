import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js"
import {
    createPoll,
    getAllPolls,
    voteOnPoll,
    votedPolls,
    closePoll,
    bookmarkPoll,
    getPollById,
    getBookmarkedPolls,
    deletePoll
} from "../controllers/poll.controller.js";

const router = Router();

router.post("/create", protect, createPoll);
router.get("/getAllPolls", protect, getAllPolls);
router.get("/votedPolls", protect, votedPolls);
router.get("/:id", protect, getPollById);
router.post("/:id/vote", protect, voteOnPoll);
router.post("/:id/close", protect, closePoll);
router.post("/:id/bookmark", protect, bookmarkPoll);
router.get("/:id/bookmarked", protect, getBookmarkedPolls);
router.delete("/:id/delete", protect, deletePoll);


export default router;