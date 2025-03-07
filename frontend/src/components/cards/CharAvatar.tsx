import { getInitials } from '../../utils/helper'

const CharAvatar = ({ fullname,
    width = 'w-12',
    height = 'h-12',
    style = '' }: any) => {
    return (
        <div className={`${width} ${height} ${style} flex items-center justify-center rounded-full text-gray-900 font-medium bg-gray-100 `}>
            {getInitials(fullname || "")}
        </div>
    )
}

export default CharAvatar