import { createContext, useState } from 'react'

export const Usercontext = createContext<{
    user: User | null,
    updateUser: (userData: User) => void,
    clearUser: () => void
}>({
    user: null,
    updateUser: (_userData: User) => { },
    clearUser: () => { }
});

type User = {
    _id: string,
    username: string,
    email: string,
    fullName: string,
    profileImageUrl: string,
    password: string,
    bookmarkedPolls: [],
    createdAt: string,
    updatedAt: string,
    __v: number,
    totalPollsVotes: number,
    totalPollsCreated: number,
    totalPollsBookmarked: number
}

const UserProvider = ({ children }: any) => {
    const [user, setUser] = useState<User | null>(null);

    // update the userdata
    const updateUser = (userData: User) => {
        setUser(userData)
    }

    // Clear user data (used for logout)
    const clearUser = (): void => {
        setUser(null);
    }

    return (
        <Usercontext.Provider value={{ updateUser, clearUser, user }}>
            {children}
        </Usercontext.Provider>
    )
}

export default UserProvider