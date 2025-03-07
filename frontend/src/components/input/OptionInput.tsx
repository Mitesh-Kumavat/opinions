import { useState } from "react"
import { HiOutlineTrash } from "react-icons/hi";
import { HiMiniPlus } from "react-icons/hi2";

const OptionInput = ({ optionList, setOptionList }: any) => {

    const [option, setOption] = useState<any>();

    const handleAddOption = () => {
        if (option.trim() && optionList.length < 4) {
            setOptionList([...optionList, option.trim()]);
            setOption("");
        }
    }

    const handleDeleteOption = (index: number) => {
        const updatedOptions = optionList.filter((_: any, idx: number) => idx !== index);
        setOptionList(updatedOptions)
    }

    return (
        <div>
            {optionList.map((item: any, index: number) => (
                <div key={index} className="flex justify-between bg-gray-200/80 px-4 py-2 mb-3 rounded-md">
                    <p className="text-xs font-medium text-black">{item}</p>
                    <button
                        onClick={() => handleDeleteOption(index)}
                    >
                        <HiOutlineTrash className="text-lg text-red-500 " />
                    </button>
                </div>
            ))}

            {optionList.length < 4 && (
                <div className="flex items-center gap-5 mt-4">
                    <input
                        type="text"
                        placeholder="Enter Option"
                        value={option}
                        className="w-full text-[13px] text-black outline-none bg-gray-200/80 px-3 py-[6px] rounded-md "
                        onChange={({ target }) => setOption(target.value)}
                    />
                    <button
                        className="btn-small text-nowrap py-[6px]"
                        onClick={handleAddOption}
                    >
                        <HiMiniPlus className="text-lg" /> Add Option
                    </button>
                </div>
            )}
        </div>
    )
}

export default OptionInput