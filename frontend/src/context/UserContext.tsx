import { createContext, useState, ReactNode } from "react";

type User = {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    profileImageUrl: string;
    password: string;
    bookmarkedPolls: [];
    createdAt: string;
    updatedAt: string;
    __v: number;
    totalPollsVotes: number;
    totalPollsCreated: number;
    totalPollsBookmarked: number;
};

type UserContextType = {
    user: User | null;
    updateUser: (userData: User) => void;
    onUserVoted: () => void;
    clearUser: () => void;
    toggleBookmarkId: (pollId: number) => void;
    onPollCreateOrDelete: (type?: "create" | "delete") => void;
};

export const Usercontext = createContext<UserContextType>({
    user: null,
    updateUser: () => { },
    clearUser: () => { },
    onUserVoted: () => { },
    toggleBookmarkId: () => { },
    onPollCreateOrDelete: () => { },
});

const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Update user stats
    const updateUserStats = (key: keyof User, value: any) => {
        setUser((prev) =>
            prev ? { ...prev, [key]: value } : null
        );
    };

    // Update user data
    const updateUser = (userData: User) => {
        setUser(userData);
    };

    // On user votes increase the count of the vote locally
    const onUserVoted = () => {
        const totalPollsVotes = user?.totalPollsVotes || 0;
        updateUserStats("totalPollsVotes", totalPollsVotes + 1);
    }

    // Update total count of posts locally
    const onPollCreateOrDelete = (type: "create" | "delete" = "create") => {
        if (!user) return;
        const totalPollsCreated = user.totalPollsCreated || 0;
        updateUserStats(
            "totalPollsCreated",
            type === "create" ? totalPollsCreated + 1 : Math.max(0, totalPollsCreated - 1)
        );
    };

    // Toggle bookmark count of polls locally
    const toggleBookmarkId = (pollId: number) => {
        const bookmarks: any[] = user?.bookmarkedPolls || [];
        const index = bookmarks.indexOf(pollId);

        if (index === -1) {
            setUser((prev: any) => ({
                ...prev,
                bookmarkedPolls: [...bookmarks, pollId],
                totalPollsBookmarked: prev?.totalPollsBookmarked + 1
            }));
        } else {
            setUser((prev: any) => ({
                ...prev,
                bookmarkedPolls: [...bookmarks, pollId],
                totalPollsBookmarked: prev?.totalPollsBookmarked - 1
            }));
        }

    }

    // Clear user data (logout)
    const clearUser = () => {
        setUser(null);
    };

    return (
        <Usercontext.Provider value={{ user, toggleBookmarkId, updateUser, clearUser, onPollCreateOrDelete, onUserVoted }}>
            {children}
        </Usercontext.Provider>
    );
};

export default UserProvider;
