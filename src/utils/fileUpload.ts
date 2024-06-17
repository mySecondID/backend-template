import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY!,
    api_secret: process.env.CLOUDINARY_CLOUD_PASSWORD!,
    secure: true,
});

const uploadtoCloudinary = async (pathToFile: string) => {
    try{
        if(!pathToFile)return null;
        const response = cloudinary.uploader.upload(pathToFile)
        console.log(`file uploaded: `,response)
        return response
    }catch (err){
        fs.unlinkSync(pathToFile);
    }
}

export {uploadtoCloudinary}