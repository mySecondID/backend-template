import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'



const uploadtoCloudinary = async (pathToFile: string) => {
    try{
        if(!pathToFile)
            return null;
        const response = await cloudinary.uploader.upload(pathToFile, {
            resource_type: "auto"
        })
        console.log(`file uploaded: ${JSON.stringify(response)}`)
        return response
    }catch (err){
        console.log("err:: ", err)
        fs.unlinkSync(pathToFile);
        return null;
    }
}

export {uploadtoCloudinary}