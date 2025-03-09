import { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout'
import useUserAuth from '../../hooks/useUserAuth'
import HeaderWithFilter from '../../components/layout/HeaderWithFilter';
import { axiosInstance } from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PollCard from '../../components/cards/PollCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Usercontext } from '../../context/UserContext';
import EmptyCard from '../../components/cards/EmptyCard';

const MyPolls = () => {
    useUserAuth();
    const { user } = useContext(Usercontext);
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
            const response = await axiosInstance.get(`${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}&creatorId=${user?._id}`);
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
            error.response.data.statusCode === 500 ? console.log(error.message) : toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const loadMorePage = () => {
        setPage((prevPage: any) => prevPage + 1);
    }

    useEffect(() => {
        setPage(1);
        fetchAllPolls(1);
    }, [user, filterType])

    useEffect(() => {
        if (page !== 1) {
            fetchAllPolls();
        }
    }, [page])

    return (
        <DashboardLayout activeMenu='My Polls'>
            <div className='my-5 mx-auto'>

                <HeaderWithFilter
                    title="My Polls"
                    filterType={filterType}
                    setFilterType={setFilterType}
                />

                {allPolls.length == 0 && (
                    <EmptyCard
                        message={`Welcome  ${user?.fullName}! You haven't created any poll yet. Let's create a poll.`}
                        btnText='Create Poll'
                        onClick={() => navigate('/create-poll')}
                    />
                )}

                <InfiniteScroll
                    dataLength={allPolls.length || 0}
                    next={loadMorePage}
                    hasMore={hasMore ?? false}
                    endMessage={<p className='info-text'>No more polls to display</p>}
                    loader={<h4 className='info-text'>Loading...</h4>}
                >


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
                            creatorId={poll.creator._id}
                            creatorUserName={poll.creator.username}
                            userHasVoted={poll.userHasVoted || false}
                            isPollClosed={poll.closed || false}
                            createdAt={poll.createdAt || false}
                        />

                    ))}
                </InfiniteScroll>
            </div>
        </DashboardLayout>
    )
}

export default MyPolls