export const BASE_URL = `https://opinions-wb1f.onrender.com/api/v1`;

export const API_PATHS = {
    AUTH: {
        LOGIN: `${BASE_URL}/auth/login`,
        REGISTER: `${BASE_URL}/auth/register`,
        GET_USER_INFO: `${BASE_URL}/auth/user`,
        UPDATE_PROFILE: `${BASE_URL}/auth/update`
    },
    POLLS: {
        CREATE: `${BASE_URL}/poll/create`,
        GET_ALL: `${BASE_URL}/poll/getAllPolls`,
        GET_BY_ID: (pollId: number) => `${BASE_URL}/poll/${pollId}`,
        VOTE: (pollId: number) => `${BASE_URL}/poll/${pollId}/vote`,
        CLOSE: (pollId: number) => `${BASE_URL}/poll/${pollId}/close`,
        BOOKMARK: (pollId: number) => `${BASE_URL}/poll/${pollId}/bookmark`,
        GET_BOOKMARKED: `${BASE_URL}/poll/user/bookmarked`,
        VOTED_POLLS: `${BASE_URL}/poll/votedPolls`,
        DELETE: (pollId: number) => `${BASE_URL}/poll/${pollId}/delete`
    },
    IMAGE: {
        UPLOAD: `${BASE_URL}/auth/upload-image`
    }
};
