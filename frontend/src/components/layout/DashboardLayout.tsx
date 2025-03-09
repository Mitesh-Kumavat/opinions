import { useContext } from 'react'
import Navbar from './Navbar'
import SideMenu from './SideMenu'
import { Usercontext } from '../../context/UserContext'
import UserDetailsCard from '../cards/UserDetailsCard'
import TrendingPolls from './TrendingPolls'

const DashboardLayout = ({ children, activeMenu, stats = [], showStats }: any) => {

    const { user } = useContext(Usercontext);

    return (
        <div>
            <Navbar activeMenu={activeMenu} />

            {user && (<div className='flex'>
                <div className='max-[1080px]:hidden'>
                    <SideMenu activeMenu={activeMenu} />
                </div>

                <div className='grow mx-5'>
                    {children}
                </div>
                <div className='hidden md:block mr-5'>
                    <UserDetailsCard
                        profileImageUrl={user && user.profileImageUrl}
                        fullname={user && user.fullName}
                        username={user && user.username}
                        totalPollsVotes={user && user.totalPollsVotes}
                        totalPollsCreated={user && user.totalPollsCreated}
                        totalPollsBookmarked={user && user.totalPollsBookmarked}
                    />

                    {showStats && stats.length > 0 && (
                        <TrendingPolls
                            stats={stats}
                        />)}
                </div>
            </div>)}
        </div>
    )
}

export default DashboardLayout