import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa6'
import { loadConfigFromFile } from 'vite'

const PollActions = ({
    pollId,
    isVoteComplete,
    inputCaptured,
    onVoteSubmit,
    isBookmarked,
    toggleBookmark,
    isMyPoll,
    pollClosed,
    onClosePoll,
    onDelete
}: any) => {

    const [loading, setLoading] = useState<boolean>(false);

    const handleVoteClick = async () => {
        setLoading(true);
        try {
            await onVoteSubmit();
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex items-center gap-4'>
            {(isVoteComplete || pollClosed) && (
                <div className='text-[11px] font-medium text-slate-600 bg-sky-700/10 px-3 py-1 rounded-md'>
                    {pollClosed ? "Closed" : "Voted"}
                </div>
            )}

            <button
                className='icon-btn'
                onClick={toggleBookmark}
            >
                {isBookmarked ? (
                    <FaBookmark className='text-primary' />
                ) : (
                    <FaRegBookmark />
                )}
            </button>

            {inputCaptured && !isVoteComplete && (
                <button
                    className='btn-small ml-auto'
                    onClick={handleVoteClick}
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            )}
        </div>
    )
}

export default PollActions