import React from 'react'

const EmptyCard = ({ btnText, onClick, message }: {
    btnText: string,
    onClick: React.MouseEventHandler<HTMLButtonElement>,
    message: string
}) => {
    return (
        <div className='bg-gray-100/50 flex flex-col items-center justify-center my-6 py-20 rounded-lg'>
            <p className='w-3/2 mx-auto text-center text-lg md:text-[18px] text-slate-900 leading-6 mt-7'>{message}</p>
            {btnText &&
                <button className='btn-small text-base px-6 py-2 mt-7' onClick={onClick}>
                    {btnText}
                </button>
            }

        </div>
    )
}

export default EmptyCard