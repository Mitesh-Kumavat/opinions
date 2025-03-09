import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout'
import useUserAuth from '../../hooks/useUserAuth'
import { axiosInstance } from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PollCard from '../../components/cards/PollCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import EmptyCard from '../../components/cards/EmptyCard';

const Bookmarks = () => {
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
            const response = await axiosInstance.get(API_PATHS.POLLS.GET_BOOKMARKED);
            if (response.data?.data.bookmarkedPolls?.length > 0) {
                setAllPolls((prevPolls: Array<Object>) => overridePage === 1 ?
                    response.data.data.bookmarkedPolls :
                    [...prevPolls, ...response.data.data.bookmarkedPolls]
                )
                setStats(response.data.data?.stats || []);
                setHasMore(response.data?.data?.bookmarkedPolls.length === PAGE_SIZE);
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

    const loadMorePage = () => {
        setPage((prevPage: any) => prevPage + 1);
    }

    useEffect(() => {
        setPage(1);
        fetchAllPolls(1);
    }, [filterType])

    useEffect(() => {
        if (page !== 1) {
            fetchAllPolls();
        }
    }, [page])

    return (
        <DashboardLayout activeMenu='Bookmarks'>
            <div className='my-5 mx-auto'>
                <h2 className='sm:text-xl font-medium text-black'>Bookmarked Polls</h2>
                {allPolls.length === 0 && (
                    <EmptyCard
                        message="You haven't bookmared any polls."
                        btnText='Bookmark Poll'
                        onClick={() => navigate('/dashboard')}
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
                            creatorUserName={poll.creator.username}
                            userHasVoted={poll.userHasVoted || false}
                            creatorId={poll.creator._id}
                            isPollClosed={poll.closed || false}
                            createdAt={poll.createdAt || false}
                        />

                    ))}
                </InfiniteScroll>
            </div>
        </DashboardLayout>
    )
}

export default Bookmarks