import { useContext, useState } from "react";
import { Usercontext } from "../../context/UserContext";
import { getPollBookmarked } from "../../utils/helper";
import UserProfileInfo from "./UserProfileInfo";
import PollActions from "./PollActions";
import PollContent from "./PollContent";

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
    createdAt }: any) => {

    const { user } = useContext(Usercontext);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(-1);
    const [rating, setRating] = useState<Number>(1);
    const [userResponse, setUserResponse] = useState<String>("");
    const [isVoteComplete, setIsVoteComplete] = useState<Boolean>(userHasVoted);
    const [pollResult, setPollResult] = useState({
        options,
        voters,
        responses
    });

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

    const [pollBookmarked, setPollBookmarked] = useState<Boolean>(isPollBookmarked);
    const [pollClosed, setPollClosed] = useState<Boolean>(isPollClosed || false);
    const [pollDeleted, setPollDeleted] = useState<Boolean>(false);

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
                onVoteSubmit={() => { }}
                isBookmarked={isPollBookmarked}
                toggleBookmark={() => { }}
                // isMyPoll={isMyPoll}
                pollClosed={pollClosed}
                onClosePoll={() => { }}
                onDelete={() => { }}
            />
        </div>

        <div className="ml-14 mt-3">
            <p className="text-[15px] text-black leading-8">{question}</p>
            <div className="mt-4">
                <PollContent
                    type={type}
                    options={options}
                    selectedOptionIndex={selectedOptionIndex}
                    onOptionSelect={handleInput}
                    rating={rating}
                    onRatingChange={handleInput}
                    userResponse={userResponse}
                    onResponseChange={handleInput}
                />
            </div>
        </div>
    </div>
};

export default PollCard;
