import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"

const AuthInput: any = ({ value, label, onChange, type = 'text', placeholder }: any) => {

    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div>
            <label className='text-[13px] text-slate-800'>{label}</label>

            <div className="input-box">
                <input
                    type={
                        type === 'password' ? (showPassword ? "text" : "password") : 'text'
                    }
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e)}
                    className='w-full bg-transparent outline-none'
                />
                {
                    type === 'password' && (
                        <>
                            {showPassword ? (
                                <FaRegEyeSlash onClick={togglePassword} size={22} className='text-slate-700 cursor-pointer' />
                            ) : (
                                <FaRegEye onClick={togglePassword} size={22} className='text-primary cursor-pointer' />)
                            }
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default AuthInput