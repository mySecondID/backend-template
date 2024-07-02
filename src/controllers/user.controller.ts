import { Request, Response } from 'express'
import {asyncHandler} from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'
import { ApiResponse } from '../utils/ResponseApi'
import User from '../models/user.model'
import { uploadtoCloudinary } from '../utils/fileUpload'
import fs from 'fs'


const registerUser = asyncHandler(
    async (req: Request, res: Response) => {
        const { fullname, email, username, password } =  req.body
        
        if(!fullname || !email || !username || !password){
            throw new ApiError(403, "all fields are required") 
        }

        const existedUser = await User.findOne({
            $or: [{username}, {email}]
        })
        if(existedUser){
            return res.status(409).json(new ApiResponse(409, "user already exists"))
        }
        // console.log((req.files as { [fieldname: string]: Express.Multer.File[] })?.avatar[0].path);

        const avatarPath = (req.files as { [fieldname: string]: Express.Multer.File[] })?.avatar[0].path;
        // console.log(avatarPath)
        // const coverPath = req.files?.cover[0]?.path;
        if(!avatarPath){
            throw new ApiError(400, 'file upload krdo')
        }

        const avatar = await uploadtoCloudinary(avatarPath)
        if(!avatar){
            throw new ApiError(400, "cloudinary")
        }

        try {
            fs.unlinkSync(avatarPath);
            console.log('File deleted successfully');
        } catch (err) {
            console.error('Error deleting file:', err);
        }
        
        
        const user = await User.create({
            fullname,
            avatar: avatar.url,
            email,
            password,
            username: username.toLowerCase()
        })
        console.log(`user: ${user}`)
        return res.status(200).json(new ApiResponse(200, "ok", "ok"))
    }
)

export {registerUser}