export const validateEmail = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
}

export const validatePassword = (password: string): boolean => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    // This regex checks if the password contains at least one digit, one lowercase letter, one uppercase letter, and is between 6 to 20 characters long.

    return regex.test(password);
}

export const getInitials = (name: string) => {
    if (!name) {
        return ""
    };

    const words = name.split(" ");
    let initials = "";
    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0];
    };

    return initials.toUpperCase();
}

export const getPollBookmarked = (pollId: Number, userBookmarks: any[] = []): boolean => {
    return userBookmarks.includes(pollId);
}