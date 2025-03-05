import { useState } from "react"
import { HiOutlineTrash } from "react-icons/hi";
import { HiMiniPlus } from "react-icons/hi2";

const OptionImageSelector = ({ imageList, setImageList }: any) => {

    const [image, setImage] = useState<string | number | any>();

    const handleAddImage = (e: any) => {
        const file = e.target.files[0];
        if (file && imageList.length < 4) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageList([
                    ...imageList,
                    { base64: reader.result, file },
                ])
            };
            reader.readAsDataURL(file);
            e.target.value = null;
        };
    };

    const handleDeleteImage = (index: number) => {
        const updatedOptions = imageList.filter((_: any, idx: number) => idx !== index);
        setImageList(updatedOptions)
    }

    return (
        <div>
            {imageList.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {imageList.map((item: any, index: number) => (
                        <div key={index} className="bg-gray-600/10 rounded-md relative">
                            <img src={item.base64} className="w-full h-36 object-contain rounded-md" alt="Selected Image" />
                            <button
                                className="text-red-500 bg-gray-100 rounded-full p-2 absolute top-2 right-2 "
                                onClick={() => handleDeleteImage(index)}
                            >
                                <HiOutlineTrash className="text-lg text-red-500 " />
                            </button>
                        </div>
                    ))}
                </div>)}

            {imageList.length < 4 && (
                <div className="flex items-center gap-5">
                    <input
                        type="file"
                        accept="image/jpeg, image/png"
                        onChange={handleAddImage}
                        className="hidden"
                        id="imageInput"
                    />
                    <label
                        htmlFor="imageInput"
                        className="btn-small text-nowrap py-1 cursor-pointer "
                    >
                        <HiMiniPlus className="text-lg" />
                        Select Image
                    </label>
                </div>
            )}
        </div>
    )
}

export default OptionImageSelector