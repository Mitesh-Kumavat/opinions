
const ImageOptionInputTile = ({ isSelected, imgUrl, onSelect }: any) => {

    const getColors = (): string => {
        if (isSelected) {
            return "border-2 border-primary";
        }

        return "border-transparent";
    }

    return (
        <button
            className={`w-full flex items-center gap-2 bg-slate-200/40 mb-4 border rounded-md overflow-hidden ${getColors()}`}
            onClick={onSelect}
        >
            <img src={imgUrl} alt="Option" className="w-full h-36 object-contain " />
        </button>
    )
}

export default ImageOptionInputTile