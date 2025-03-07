import { User } from "../models/user.model.js";
import { Poll } from "../models/poll.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const createPoll = async (req, res) => {
    const { question, type, options, creatorId } = req.body;
    if (!question || !type || !creatorId) {
        return res.status(400).json(new ApiResponse(400, "All fields are required", "Question, type and creatorId are required"))
    };

    try {
        let proccessedOptions = [];
        switch (type) {
            case "single-choice":
                if (!options || options.length < 2) {
                    throw new ApiError(400, "Single-choice poll must have at least 2 options.")
                }
                proccessedOptions = options.map((option) => ({ optionText: option }));
                break;
            case "open-ended":
                proccessedOptions = [];
                break;
            case "rating":
                proccessedOptions = [1, 2, 3, 4, 5].map((val) => ({
                    optionText: val.toString()
                }));
                break;
            case "yes/no":
                proccessedOptions = ["Yes", "No"].map((val) => ({
                    optionText: val
                }));
                break;
            case "image-based":
                if (!options || options.length < 2) {
                    return res.status(400).json(new ApiResponse(400, "Image based poll must have at least 2 images", "Insufficient Images."));
                }
                proccessedOptions = options.map((url) => ({ optionText: url }))
                break;
            default:
                return res.status(400).json(new ApiResponse(400, "Select the valid poll type.", "Invalid poll type."));
                break;
        };

        const newPoll = await Poll.create({
            question,
            type,
            options: proccessedOptions,
            creator: creatorId,
        })

        return res.status(200).json(new ApiResponse(200, newPoll, "Poll Succesfully created"))

    } catch (error) {
        console.log(error);
        return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, error, error.message || 'Internal Server Error'));
    }
}

export const getAllPolls = async (req, res) => {
    const { type, creatorId, page = 1, limit = 10 } = req.query;
    const filter = {};
    const userId = req.user._id;

    if (type) filter.type = type;
    if (creatorId) filter.creator = creatorId;

    try {
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;

        // Fetch polls with pagination
        const polls = await Poll.find(filter)
            .populate("creator", "fullName username email profileImageUrl")
            .populate({
                path: "responses.voterId",
                select: "username profileImageUrl fullName",
            })
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 });

        // Add `useHasVoted` flag for each poll
        const updatePolls = polls.map((poll) => {
            const userHasVoted = poll.voters.some((voterId) => voterId.equals(userId));
            return {
                ...poll.toObject(),
                userHasVoted,
            };
        });

        const totalPolls = await Poll.countDocuments(filter);

        const stats = await Poll.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    type: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ]);

        const allTypes = [
            { type: "single-choice", label: "Single Choice" },
            { type: "yes/no", label: "Yes/No" },
            { type: "rating", label: "Rating" },
            { type: "image-based", label: "Image Based" },
            { type: "open-ended", label: "Open Ended" },
        ];

        const statsWithDefaults = allTypes.map((pollType) => {
            const stat = stats.find((item) => item.type === pollType.type);

            return {
                label: pollType.label,
                type: pollType.type,
                count: stat ? stat.count : 0
            }
        }).sort((a, b) => b.count - a.count);

        const response = new ApiResponse(200, {
            polls: updatePolls,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalPolls / pageSize),
            totalPolls,
            stats: statsWithDefaults,
        })

        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, error, error.message || 'Internal Server Error'));
    }
};

export const getPollById = async (req, res) => {
    const { id } = req.params;

    try {
        const poll = await Poll.findById(id).populate("creator", "username email");

        if (!poll) {
            throw new ApiError(400, "Poll not found")
        }

        return res.status(200).json(new ApiResponse(200, poll))
    } catch (error) {
        console.log(error);
        return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, error, error.message || 'Internal Server Error'));
    }
};

export const voteOnPoll = async (req, res) => {
    const { id } = req.params;
    const { optionIndex, voterId, responseText } = req.body;

    try {
        const poll = await Poll.findById(id);

        if (!poll) {
            throw new ApiError(400, "Poll not found");
        }

        if (poll.closed) {
            throw new ApiError(400, "Poll is closed");
        }

        if (poll.voters.includes(voterId)) {
            throw new ApiError(400, "User has already voted on this poll");
        }

        if (poll.type === "open-ended") {
            if (!responseText) {
                throw new ApiError(400, "Response Text is required for open ended polls.");
            }

            poll.responses.push({
                voterId,
                responseText
            });
        } else {
            if (optionIndex === undefined || optionIndex < 0 || optionIndex >= poll.options.length) {
                throw new ApiError(400, "Invalid option index.");
            }

            poll.options[optionIndex].votes += 1;
        }

        poll.voters.push(voterId);
        await poll.save();

        return res.status(200).json(new ApiResponse(200, poll));

    } catch (error) {
        console.log(error);
        return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, error, error.message || 'Internal Server Error'));
    }
};

export const getvotedPolls = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    try {
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;

        const polls = await Poll.find({ voters: userId })
            .populate("creator", "fullName profileImageUrl username email")
            .populate({
                path: "responses.voterId",
                select: "username fullName profileImageUrl"
            })
            .skip(skip)
            .limit(pageSize);

        const updatedPolls = polls.map((poll) => {
            const userHasVoted = poll.voters.some((voterId) => voterId.equals(userId));
            return {
                ...poll.toObject(),
                userHasVoted,
            };
        });

        const totalVotedPolls = await Poll.countDocuments({ voters: userId });

        const response = new ApiResponse(200, {
            polls: updatedPolls,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalVotedPolls / pageSize),
            totalVotedPolls,
        })

        return res.status(200).json(response);

    } catch (error) {
        console.log(error);
        return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, error, error.message || 'Internal Server Error'));
    }
};

export const closePoll = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const poll = await Poll.findById(id);

        if (!poll) {
            throw new ApiError(400, "Poll not found.")
        }

        if (poll.creator.toString() !== (userId).toString()) {
            throw new ApiError(403, "You are not authorized to close this poll.")
        }

        poll.closed = true;
        await poll.save();

        return res.status(200).json(new ApiResponse(200, poll, "Poll closed Successfully"))
    } catch (error) {
        console.log(error);
        return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, error, error.message || 'Internal Server Error'));
    }
};

export const bookmarkPoll = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const isBookmarked = user.bookmarkedPolls.includes(id);

        if (isBookmarked) {
            user.bookmarkedPolls = user.bookmarkedPolls.filter((pollId) => pollId.toString() !== id)
            await user.save();

            return res.status(200).json(new ApiResponse(200, {
                bookmarkedPolls: user.bookmarkedPolls,
                message: "Poll removed from bookmarks"
            }, "poll removed from bookmarks"))
        }

        user.bookmarkedPolls.push(id);
        await user.save();
        return res.status(200).json(new ApiResponse(200, {
            bookmarkedPolls: user.bookmarkedPolls,
            message: "Poll added to bookmarks"
        }, "poll added to bookmarks"))

    } catch (error) {
        console.log(error);
        return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, error, error.message || 'Internal Server Error'));
    }
};

export const deletePoll = async (req, res) => {

    const { id } = req.params;
    const userId = req.user._id;

    try {
        const poll = await Poll.findById(id);

        if (!poll) {
            throw new ApiResponse(404, "Poll not found");
        }

        if (poll.creator.toString() !== (userId).toString()) {
            throw new ApiResponse(403, {}, "You are not authorized to delete this post.")
        }

        await Poll.findByIdAndDelete(id);

        return res.status(200).json(new ApiResponse(200, poll, "Poll deleted successfully"));

    } catch (error) {
        console.log(error);
        return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, error, error.message || 'Internal Server Error'));
    }
};

export const getBookmarkedPolls = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId).populate({
            path: "bookmarkedPolls",
            populate: {
                path: "creator",
                select: "fullName username profileImageUrl"
            }
        })

        if (!user) throw new ApiError(404, "User not found")

        const bookmarkedPolls = user.bookmarkedPolls;

        const updatedPolls = bookmarkedPolls.map((poll) => {
            const userHasVoted = poll.voters.some((voterId) => voterId.equals(userId));

            return {
                ...poll.toObject(),
                userHasVoted
            };
        })

        const response = new ApiResponse(200, {
            bookmarkedPolls: updatedPolls,
        })

        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, error, error.message || 'Internal Server Error'));
    }
};