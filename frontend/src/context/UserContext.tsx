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
    clearUser: () => void;
    onPollCreateOrDelete: (type?: "create" | "delete") => void;
};

export const Usercontext = createContext<UserContextType>({
    user: null,
    updateUser: () => { },
    clearUser: () => { },
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

    // Update total count of posts locally
    const onPollCreateOrDelete = (type: "create" | "delete" = "create") => {
        if (!user) return;
        const totalPollsCreated = user.totalPollsCreated || 0;
        updateUserStats(
            "totalPollsCreated",
            type === "create" ? totalPollsCreated + 1 : Math.max(0, totalPollsCreated - 1)
        );
    };

    // Clear user data (logout)
    const clearUser = () => {
        setUser(null);
    };

    return (
        <Usercontext.Provider value={{ user, updateUser, clearUser, onPollCreateOrDelete }}>
            {children}
        </Usercontext.Provider>
    );
};

export default UserProvider;
