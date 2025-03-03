import { API_PATHS } from "./apiPaths";
import { axiosInstance } from "./axiosInstance";

export const uploadImage = async (imageFile: any) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response: any = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })

        return response.data.data;
    } catch (error) {
        console.log("Error while uploading the image : ", error);
        throw error;
    }

}