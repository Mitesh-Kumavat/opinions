import moment from "moment";
import CharAvatar from "./CharAvatar";

const OpenEndedPollResult = ({ profileImageUrl, userFullName, response, createdAt }: any) => {
    return (
        <div className="mb-6 ml-3 bg-gray-200/80 p-4 rounded-md">
            <div className="flex gap-3">
                {profileImageUrl ? (
                    <img src={profileImageUrl} alt={userFullName} className="w-8 h-8 rounded-full" />
                ) : (
                    <CharAvatar
                        fullName={userFullName}
                        style="w-8 h-8 text-[10px] bg-sky-800/40"
                    />
                )}
                <p className="text-[13px] text-black">
                    {userFullName}{" "}
                    <span className="mx-1 text-[10px] text-slate-500">•</span>
                    <span className="text-[10px] text-slate-500">{createdAt}</span>
                </p>
            </div>
            <p className="text-xs text-slate-700 -mt-2 ml-[44px]">
                {response}
            </p>
        </div>
    )
}

const ImagePollResult = ({ imgUrl, optionVotes, totalVotes }: any) => {
    return (
        <div>
            <div className="w-full bg-gray-800 flex items-center gap-2 mb-4 rounded-md overflow-hidden">
                <img src={imgUrl} alt="Option Image" className="w-full mb-2 h-36 object-contain" />
            </div>
            <PollOptionVoteResult optionVotes={optionVotes} totalVotes={totalVotes} />
        </div>
    )
}

const PollOptionVoteResult = ({ label, optionVotes, totalVotes }: any) => {
    const progress = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;

    return (
        <div className="w-full bg-slate-200/80 rounded-md h-6 relative mb-3 ">
            <div
                className="bg-sky-900/10 h-6 rounded-md "
                style={{ width: `${progress}%` }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-between text-gray-800 text-[12px] font-medium mx-4">
                {label}
                <span className="text-[11px] text-slate-500">
                    {progress}%
                </span>
            </span>
        </div>
    )
}

const PollingResultContent = ({ type, options, voters, responses }: any) => {
    switch (type) {
        case "single-choice":
        case "yes/no":
        case "rating":
            return (
                <>
                    {options.map((option: any, index: number) => (
                        <PollOptionVoteResult
                            key={index}
                            label={`${option.optionText} ${type === "rating" ? "Star" : ""}`}
                            optionVotes={option.votes}
                            totalVotes={voters || 0}
                        />
                    ))}
                </>
            )
        case "image-based":
            return (
                <div className="grid grid-cols-2 gap-4">
                    {options.map((option: any, index: number) => (
                        <ImagePollResult
                            key={index}
                            imgUrl={option.optionText || ""}
                            optionVotes={option.votes}
                            totalVotes={voters || 0}
                        />
                    ))}
                </div>
            )
        case "open-ended":
            return responses.map((response: any) => < OpenEndedPollResult
                key={response._id}
                profileImageUrl={response.voterId?.profileImageUrl}
                userFullName={response.voterId?.fullName || "Unknown Person"}
                response={response.responseText || ""}
                createdAt={response.createdAt ? moment(response.createdAt).fromNow() : "No Details"}
            />
            )
        default:
            return null;
    }
}

export default PollingResultContent