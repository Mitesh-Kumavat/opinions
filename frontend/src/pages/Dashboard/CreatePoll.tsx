import React, { useContext, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import useUserAuth from '../../hooks/useUserAuth'
import { Usercontext } from '../../context/UserContext';
import { POLL_TYPE } from '../../utils/data';
import OptionInput from '../../components/input/OptionInput';
import OptionImageSelector from '../../components/input/OptionImageSelector';
import { uploadImage } from '../../utils/uploadImage';
import { axiosInstance } from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';

const CreatePoll: React.FC = () => {
    useUserAuth();

    const { user, onPollCreateOrDelete } = useContext(Usercontext);
    const [pollData, setPollData] = useState({
        question: "",
        type: "",
        options: [],
        imageOptions: [],
        error: "",
    });

    const clearData = () => {
        setPollData({
            question: "",
            type: "",
            options: [],
            imageOptions: [],
            error: ""
        });
    };

    const handleValueChange = (key: string, value: any) => {
        setPollData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const updateImageAndGetLink = async (imageOptions: any) => {
        const optionPromise = imageOptions.map(async (imageOption: any) => {
            try {
                const imageUploadRes = await uploadImage(imageOption.file);
                return imageUploadRes || "";
            } catch (error) {
                toast.error(`Error while uploading image: ${imageOption?.file?.name}`);
                return "";
            }
        });

        const optionArr = await Promise.all(optionPromise);
        return optionArr;
    }

    const getOptions = async () => {
        switch (pollData.type) {
            case "single-choice":
                return pollData.options;
            case "image-based":
                const options = await updateImageAndGetLink(pollData.imageOptions);
                return options;
            default:
                return [];
        }
    }

    const handleCreatePoll = async () => {
        const { question, type, error, options, imageOptions } = pollData;

        if (!question || !type) {
            console.log('CREATE : ', { question, type, error, options });
            handleValueChange("error", "Question & Type are requried.")
            return;
        }

        if (type === "single-choice" && options.length < 2) {
            handleValueChange("error", "Enter at least 2 options.")
            return;
        }

        if (type === "image-based" && imageOptions.length < 2) {
            handleValueChange("error", "Provide at least 2 Images.")
            return;
        }

        handleValueChange("error", "");

        const optionData = await getOptions();

        try {
            const response = await axiosInstance.post(API_PATHS.POLLS.CREATE, {
                question,
                type,
                options: optionData,
                creatorId: user?._id
            })
            console.log(response.data);
            if (response && response.status.toString().startsWith("2")) {
                onPollCreateOrDelete("create");
                toast.success("Poll Created Successfully.")
            } else {
                toast.success(response.data.message || "Poll is not created.")
            }
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message || "Error while creating a post.")
                handleValueChange("error", error.response.data.message);
            } else {
                handleValueChange("error", "Something went wrong. Please Try again.");
            }
        } finally {
            // clearData();
        }
    }

    return (
        <DashboardLayout activeMenu="Create Poll">
            <div className='bg-gray-100/80 my-5 p-5 rounded-lg mx-auto'>
                <h2 className='text-lg text-black font-medium'>Create Poll</h2>

                <div className='mt-3'>
                    <label className="text-xs font-medium text-slate-600">QUESTION</label>
                    <textarea
                        className="w-full text-[13px] text-balck outline-none bg-slate-200/80 p-2 rounded-md mt-2"
                        rows={4}
                        value={pollData.question}
                        onChange={({ target }) => {
                            handleValueChange("question", target.value)
                        }}
                        placeholder="What's in your mind?"></textarea>
                </div>

                <div className='mt-3'>
                    <label className="text-xs font-medium text-slate-600 ">POLL TYPE</label>
                    <div className='flex gap-4 flex-wrap mt-3'>
                        {POLL_TYPE.map((item) => (
                            <div
                                key={item.id}
                                className={`option-chip ${pollData.type === item.value
                                    ? 'text-white bg-primary border-primary'
                                    : 'border-sky-100  '
                                    }`}
                                onClick={() => {
                                    handleValueChange("type", item.value)
                                }}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                </div>

                {pollData.type === 'single-choice' && (
                    <div className='mt-5'>
                        <label className='text-xs font-medium text-slate-600'>OPTIONS</label>

                        <div className='mt-3'>
                            <OptionInput
                                optionList={pollData.options}
                                setOptionList={(value: any) => {
                                    handleValueChange("options", value);
                                }}
                            />
                        </div>
                    </div>
                )}

                {pollData.type === 'image-based' && (
                    <div className='mt-5'>
                        <label className='text-xs font-medium text-slate-600'>IMAGE OPTIONS</label>

                        <div className='mt-3'>
                            <OptionImageSelector
                                imageList={pollData.imageOptions}
                                setImageList={(value: any) => {
                                    handleValueChange("imageOptions", value)
                                }}
                            />
                        </div>
                    </div>
                )}

                {pollData.error && (
                    <p className='text-xs font-medium text-red-500 mt-5'>
                        {pollData.error}
                    </p>
                )}

                <button
                    className='btn-primary py-2 mt-6'
                    onClick={handleCreatePoll}
                >
                    CREATE
                </button>

            </div>
        </DashboardLayout>

    )
}

export default CreatePoll