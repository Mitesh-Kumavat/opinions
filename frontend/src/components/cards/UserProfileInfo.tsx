import moment from "moment"
import CharAvatar from "./CharAvatar"

const UserProfileInfo = ({ imgUrl, fullName, username, createdAt }: any) => {
    return (
        <div className="flex items-center gap-4">
            {imgUrl ? (
                <img src={imgUrl} alt={fullName} className="w-10 h-10 rounded-full border-none" />
            ) : (
                <CharAvatar fullname={fullName} style='text-[13px]' />
            )}

            <div>
                <p className="text-sm text-black font-medium leading-4">
                    {fullName} <span className="mx-1 text-sm text-slate-500">•</span>
                    <span className="mx-1 text-[10px] text-slate-500">
                        {createdAt && moment(createdAt).fromNow()}
                    </span>
                </p>
                <span className="text-[11.5px] text-slate-500 leading-4">
                    @{username}
                </span>
            </div>
        </div>
    )
}

export default UserProfileInfo