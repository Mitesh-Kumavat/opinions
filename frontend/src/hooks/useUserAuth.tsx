import { useContext, useEffect } from 'react'
import { Usercontext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const useUserAuth = () => {

    const { clearUser, updateUser, user } = useContext(Usercontext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) return
        let isMounted = true;

        const fetchUserInfo = async () => {
            try {
                const res: any = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
                if (isMounted && res?.data) {
                    updateUser(res.data.data)
                }
            } catch (error) {
                console.log(error);
                if (isMounted) {
                    clearUser();
                    navigate('/login')
                }
            }
        }

        fetchUserInfo();

        return () => {
            isMounted = false;
        }
    }, [])
}

export default useUserAuth