import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout'
import useUserAuth from '../../hooks/useUserAuth'
import HeaderWithFilter from '../../components/layout/HeaderWithFilter';
import { axiosInstance } from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PollCard from '../../components/cards/PollCard';

const Home = () => {
    useUserAuth();
    const PAGE_SIZE = 10;
    const navigate = useNavigate();
    const [allPolls, setAllPolls] = useState<any>([]);
    const [stats, setStats] = useState<any>([]);
    const [page, setPage] = useState<Number>(1);
    const [hasMore, setHasMore] = useState<Boolean>();
    const [loading, setLoading] = useState<Boolean>(false);
    const [filterType, setFilterType] = useState("");

    const fetchAllPolls = async (overridePage = page) => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}`);
            if (response.data?.data.polls?.length > 0) {
                setAllPolls((prevPolls: Array<Object>) => overridePage === 1 ?
                    response.data.data.polls :
                    [...prevPolls, ...response.data.data.polls]
                )
                setStats(response.data.data?.stats || []);
                setHasMore(response.data?.data?.polls.length === PAGE_SIZE);
            } else {
                setHasMore(false);
            }

        } catch (error: any) {
            console.log(error);
            toast.error(error?.message);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        setPage(1);
        fetchAllPolls(1);
        return () => { }
    }, [filterType])

    useEffect(() => {
        if (page !== 1) {
            fetchAllPolls();
        }
        return () => { }
    }, [page])

    return (
        <DashboardLayout activeMenu='Dashboard'>
            <div className='my-5 mx-auto'>

                <HeaderWithFilter
                    title="Polls"
                    filterType={filterType}
                    setFilterType={setFilterType}
                />

                {allPolls.map((poll: any) => (
                    <PollCard
                        key={`dashboard_${poll._id}`}
                        pollId={poll._id}
                        question={poll.question}
                        type={poll.type}
                        options={poll.options}
                        voters={poll.voters.length || 0}
                        responses={poll.responses || []}
                        creatorProfileImg={poll.creator.profileImageUrl || null}
                        creatorName={poll.creator.fullName}
                        creatorUserName={poll.creator.username}
                        userHasVoted={poll.userHasVoted || false}
                        isPollClosed={poll.closed || false}
                        createdAt={poll.createdAt || false}
                    />

                ))}

            </div>
        </DashboardLayout>
    )
}

export default Home