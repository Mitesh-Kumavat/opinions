import React, { useState } from 'react'
import AuthLayout from '../../components/layout/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import AuthInput from '../../components/input/AuthInput'
import { validateEmail, validatePassword } from '../../utils/helper'

const LoginForm: React.FC = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // handle login form submission
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!email || !password) {
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

        // API call for login
        try {

            navigate('/dashboard');
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <AuthLayout>
            <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
                <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
                <p className='text-xs text-slate-700 mt-[5px] mb-6'>Please enter your details to log in</p>
                <form onSubmit={handleSubmit}>
                    <AuthInput
                        value={email}
                        label={"Email Address"}
                        onChange={({ target }: any) => setEmail(target.value)}
                        type='email'
                        placeholder='Enter your email address'
                    />
                    <AuthInput
                        value={password}
                        label={"Password"}
                        onChange={({ target }: any) => setPassword(target.value)}
                        type='password'
                        placeholder='Enter your password'
                    />

                    {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

                    <button type='submit' className='btn-primary'> Login</button>

                    <p className='text-[13px] text-slate-800 mt-3'>Don't have an account? <Link className='font-medium text-primary underline ' to={"/signup"}> SignUp</Link></p>
                </form>
            </div>
        </AuthLayout >
    )
}

export default LoginForm