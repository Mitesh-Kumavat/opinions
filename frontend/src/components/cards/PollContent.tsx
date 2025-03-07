import React from 'react'

const PollContent = ({
    type,
    options,
    selectedOptionIndex,
    onOptionSelect,
    rating,
    onRatingChange,
    userResponse,
    onResponseChange
}: any) => {
    return (
        <div>{type}</div>
    )
}

export default PollContent