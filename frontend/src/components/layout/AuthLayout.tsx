import React from 'react'

const AuthLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    return (
        <div className='flex'>
            <div className='w-screen h-screen md:w-1/2 px-12 pt-8 pb-12'>
                <h2 className='text-lg font-medium text-black max-sm:hidden'>Opinions - Polling App</h2>
                {children}
            </div>
        </div>
    )
}

export default AuthLayout