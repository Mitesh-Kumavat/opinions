import { defaultFormat } from 'moment'
import React from 'react'
import OptionInputTitle from '../input/OptionInputTitle'
import Rating from '../input/Rating'
import ImageOptionInputTile from '../input/ImageOptionInputTile'

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
    switch (type) {
        case "single-choice":
        case "yes/no":
            return (
                <>
                    {options.map((option: any, index: number) => (
                        <OptionInputTitle
                            key={index}
                            isSelected={selectedOptionIndex === index}
                            label={option.optionText || ""}
                            onSelect={() => onOptionSelect(index)}
                        />
                    ))}
                </>
            )
        case "rating":
            return <Rating value={rating} onChange={onRatingChange} />
        case "open-ended":
            return (
                <div className='-mt-3 '>
                    <textarea
                        placeholder='Your Response'
                        className='w-full text-[13px] text-black outline-none bg-slate-200/80 p-2 rounded-md mt-2 '
                        rows={4}
                        value={userResponse}
                        onChange={({ target }) => onResponseChange(target.value)}
                    />
                </div>
            )
        case "image-based":
            return (
                <div className='grid grid-cols-2 gap-4'>
                    {options.map((option: any, index: number) => (
                        <ImageOptionInputTile
                            key={index}
                            isSelected={selectedOptionIndex === index}
                            imgUrl={option.optionText || ""}
                            onSelect={() => onOptionSelect(index)}
                        />
                    ))}
                </div>
            )
        default:
            return null;
    }
}

export default PollContent