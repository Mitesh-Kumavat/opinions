import { useNavigate } from "react-router-dom"
import { SIDE_MENU_DATA } from "../../utils/data"
import { useContext } from "react";
import { Usercontext } from "../../context/UserContext";

const SideMenu = ({ activeMenu }: any) => {

    const navigate = useNavigate();
    const { clearUser } = useContext(Usercontext)

    const handleClick = (path: string) => {
        if (path === 'logout') {
            hanldleLogout();
            return
        }
        navigate(path);
    }

    const hanldleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
    }

    return (
        <div className="w-64 h-[calc(100vh-61px)] bg-slate-50/50 border-r border-slate-100/70 p-5 sticky top-[61px] z-20">
            {SIDE_MENU_DATA.map((item) => (
                <button
                    key={item.id}
                    className={`flex items-center w-full gap-4 text-[15px] ${activeMenu == item.label ? "text-white bg-primary" : ""
                        } py-6 px-6 rounded-full mb-3 `}
                    onClick={() => handleClick(item.path)}
                >
                    <item.icon className="text-xl" />
                    {item.label}
                </button>
            ))}
        </div>
    )
}

export default SideMenu