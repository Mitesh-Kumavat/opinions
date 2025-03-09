import { useCallback, useContext, useState } from "react";
import { Usercontext } from "../../context/UserContext";
import { getPollBookmarked } from "../../utils/helper";
import UserProfileInfo from "./UserProfileInfo";
import PollActions from "./PollActions";
import PollContent from "./PollContent";
import { axiosInstance } from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import PollingResultContent from "./PollingResultContent";
import useUserAuth from "../../hooks/useUserAuth";

const PollCard = ({
    pollId,
    question,
    type,
    options,
    voters,
    responses,
    creatorProfileImg,
    creatorName,
    creatorUserName,
    userHasVoted,
    isPollClosed,
    creatorId,
    createdAt }: any) => {

    const { user, onUserVoted, toggleBookmarkId, onPollCreateOrDelete } = useContext(Usercontext);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | any>();
    const [rating, setRating] = useState<number | any>();
    const [userResponse, setUserResponse] = useState<string>();
    const [isVoteComplete, setIsVoteComplete] = useState<boolean>(userHasVoted);

    const isPollBookmarked = getPollBookmarked(
        pollId,
        user?.bookmarkedPolls || []
    );

    const handleInput = (value: any) => {
        if (type === "rating") {
            setRating(value);
        } else if (type === "open-ended") {
            setUserResponse(value);
        } else {
            setSelectedOptionIndex(value);
        }
    }

    const isMyPoll = creatorId === user?._id;

    const [pollBookmarked, setPollBookmarked] = useState<Boolean>(isPollBookmarked);
    const [pollClosed, setPollClosed] = useState<Boolean>(isPollClosed || false);
    const [pollDeleted, setPollDeleted] = useState<Boolean>(false);
    const [pollResult, setPollResult] = useState<any>({
        options,
        voters,
        responses
    });

    // Generate poll data based on the poll type
    const getPostData = useCallback(() => {
        if (type === "open-ended") {
            return { responseText: userResponse, voterId: user?._id };
        }
        if (type === "rating") {
            return { optionIndex: rating - 1, voterId: user?._id }
        }
        return { optionIndex: selectedOptionIndex, voterId: user?._id };
    }, [type, userResponse, rating, selectedOptionIndex, user])

    // Get polls details by ID
    const getPollDetail = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.POLLS.GET_BY_ID(pollId));
            if (response.data) {
                const pollDetails: any = response.data.data;
                setPollResult({
                    options: pollDetails.options || [],
                    voters: pollDetails.voters.length || 0,
                    responses: pollDetails.responses || []
                })
                console.log(pollDetails);
            }
        } catch (error: any) {
            toast.error(error?.response?.data.message || "Error Submitting vote")
        }
    }

    // handles the submission of the votes.
    const handleVoteSubmit = async () => {
        try {
            const response = await axiosInstance.post(API_PATHS.POLLS.VOTE(pollId), getPostData());
            getPollDetail();
            onUserVoted();
            setIsVoteComplete(true);
            toast.success(response.data.messaage || "Vote submitted successfully!");
        } catch (error: any) {
            toast.error(error?.response?.data.message || "Error while submitting vote.")
        }
    }

    // handles the close poll
    const handleClosePoll = async () => {
        try {
            const response = await axiosInstance.post(API_PATHS.POLLS.CLOSE(pollId));

            if (response.data) {
                toast.success(response.data.messaage || "Poll closed successfully!")
                setPollClosed(true);
            }
        } catch (error: any) {
            toast.error(error?.response?.data.message || "Error while closing poll.")
        }
    };

    // handles the delete poll
    const handleDeletePoll = async () => {
        try {
            const response = await axiosInstance.delete(API_PATHS.POLLS.DELETE(pollId));

            if (response.data) {
                toast.success(response.data.messaage || "Poll deleted successfully!")
                setPollDeleted(true);
                onPollCreateOrDelete("delete");
                useUserAuth();
            }
        } catch (error: any) {
            toast.error(error?.response?.data.message || "Error while deleting poll.")
        }
    };

    // handles the toggle bookmark
    const handleToggleBookmark = async () => {
        try {
            const response = await axiosInstance.post(API_PATHS.POLLS.BOOKMARK(pollId));
            toggleBookmarkId(pollId);
            setPollBookmarked((prev) => !prev);
            toast.success(response.data.message);
        } catch (error: any) {
            toast.error(error?.response.data.message || "Something went wrong.")
        }
    };

    return !pollDeleted && <div className="bg-slate-100/50 my-5 py-5 rounded-lg border border-slate-100 mx-auto ">
        <div className="flex items-start px-5 justify-between">
            <UserProfileInfo
                imgUrl={creatorProfileImg}
                fullName={creatorName}
                username={creatorUserName}
                createdAt={createdAt}
            />

            <PollActions
                pollId={pollId}
                isVoteComplete={isVoteComplete}
                inputCaptured={
                    !!(userResponse || selectedOptionIndex >= 0 || rating)
                }
                onVoteSubmit={handleVoteSubmit}
                isBookmarked={pollBookmarked}
                toggleBookmark={handleToggleBookmark}
                isMyPoll={isMyPoll}
                pollClosed={pollClosed}
                onClosePoll={handleClosePoll}
                onDelete={handleDeletePoll}
            />
        </div>

        <div className="ml-14 mt-3 px-6">
            <p className="text-[15px] text-black leading-8">{question}</p>
            <div className="mt-4">
                {isVoteComplete || isPollClosed ? (
                    <PollingResultContent
                        type={type}
                        options={pollResult.options || []}
                        voters={pollResult.voters}
                        responses={pollResult.responses || []}
                    />
                ) : (
                    <PollContent
                        type={type}
                        options={options}
                        selectedOptionIndex={selectedOptionIndex}
                        onOptionSelect={handleInput}
                        rating={rating}
                        onRatingChange={handleInput}
                        userResponse={userResponse}
                        onResponseChange={handleInput}
                    />)}
            </div>
        </div>
    </div>
};

export default PollCard;
