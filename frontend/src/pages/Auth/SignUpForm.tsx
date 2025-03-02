import React, { useState } from 'react'
import AuthLayout from '../../components/layout/AuthLayout'
import AuthInput from '../../components/input/AuthInput'
import { Link, useNavigate } from 'react-router-dom';
import ProfilePhotoSelector from '../../components/input/ProfilePhotoSelector';
import { validateEmail, validatePassword } from '../../utils/helper';

const SignUpForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // handle sign up form submission
    const handleSignUp = async (e: any) => {
        e.preventDefault();
        if (!email || !password || !fullName || !userName) {
            setError("Please fill in all fields");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return
        }

        if (password.length > 20) {
            setError("Password must not be 20 characters long.");
            return
        }

        if (!validatePassword(password)) {
            setError("Password must contain at least one digit, one lowercase letter, one uppercase letter.");
            return
        }
        setError("");

        // API call for sign up
        try {

            navigate('/dashboard');
        } catch (error: any) {
            setError(error.message);
        }
    }

    return (
        <AuthLayout>
            <div className='lg:w-[70%] h-full flex flex-col justify-center'>
                <h3 className='text-xl font-semibold text-black '>Create an Account </h3>
                <p className='text-xs text-slate-700 mt-[5px] mb-6'>Join us today by entering your details today</p>
                <form onSubmit={handleSignUp} className=''>
                    <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
                        <AuthInput
                            value={fullName}
                            label={"Full Name"}
                            onChange={({ target }: any) => setFullName(target.value)}
                            type='text'
                            placeholder='John Doe'
                        />
                        <AuthInput
                            value={email}
                            label={"Email Address"}
                            onChange={({ target }: any) => setEmail(target.value)}
                            type='email'
                            placeholder='johndoe@example.com'
                        />
                        <AuthInput
                            value={userName}
                            label={"Username"}
                            onChange={({ target }: any) => setUserName(target.value)}
                            type='text'
                            placeholder='@'
                        />
                        <AuthInput
                            value={password}
                            label={"Password"}
                            onChange={({ target }: any) => setPassword(target.value)}
                            type='password'
                            placeholder='Min 6 characters'
                        />

                    </div>
                    {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

                    <button type='submit' className='btn-primary'>Sign Up</button>

                    <p className='text-[13px] text-slate-800 mt-3'>Already have an account? <Link className='font-medium text-primary underline ' to={"/login"}> Login</Link></p>
                </form>
            </div>
        </AuthLayout >
    )
}

export default SignUpForm