import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        // upload the file on cloudinary
        const uploadResult = await cloudinary.uploader
            .upload(localFilePath, { resource_type: "auto" })
            // file has been uploaded succesfully
            .catch((error) => {
                console.log("Error while Uploading on Cloudinary", error);
            });

        fs.unlinkSync(localFilePath);
        console.log("File is Uploaded on Cloudinary url: ", uploadResult.url)
        return uploadResult.url;
    } catch (error) {
        console.log("ERROR IN CLOUDINARY FILE, ", error)
        try {
            fs.unlinkSync(localFilePath)
        } catch (error) {
            //remove the locally saved temp file as the upload operation got failed
            console.log(error.message || "File has been aleady deleted.");
        }
        return null;
    }
}

export { uploadOnCloudinary }