import React, { useRef, useState } from 'react';
import { LuUser, LuTrash2, LuUpload } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage }: any) => {
    const inputRef = useRef<HTMLInputElement | any>(null);
    const [previewUrl, setPreviewUrl] = useState<string | any>(undefined);

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];

        if (file) {
            setImage(file);
            const previewURL = URL.createObjectURL(file);
            setPreviewUrl(previewURL);
        }
    }

    const handleRemoveChange = () => {
        setImage(null);
        setPreviewUrl(null);
    }

    const onChooseFile = () => {
        if (inputRef.current) inputRef.current.click();
    }

    return (
        <div className='flex justify-center mb-6'>
            <input
                type="file"
                accept='image/*'
                ref={inputRef}
                onChange={handleImageChange}
                className='hidden'
            />

            {!image ?
                (<div className='w-20 h-20 flex items-center justify-center bg-sky-100 rounded-full relative '>
                    <LuUser className="text-4xl text-primary" />

                    <button type='button' className='w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1' onClick={onChooseFile} >
                        <LuUpload />
                    </button>
                </div>)
                :
                (<div className='relative'>
                    <img src={previewUrl} alt="Profile Photo" className='w-20 h-20 rounded-full object-cover' />

                    <button type='button' className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1' onClick={handleRemoveChange} >
                        <LuTrash2 />
                    </button>
                </div>)
            }
        </div>
    )
}

export default ProfilePhotoSelector