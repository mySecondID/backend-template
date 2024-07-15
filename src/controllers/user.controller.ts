import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'
import { ApiResponse } from '../utils/ResponseApi'
import User from '../models/user.model'
import { uploadtoCloudinary } from '../utils/fileUpload'
import fs from 'fs'
import jwt from 'jsonwebtoken'


const generateAccessandRefreshToken = async (user: any) => {
    try{
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return {accessToken, refreshToken};
    }catch(err){
        throw new ApiError(500, "Error while generating access and refresh tokens");
    }
}

const registerUser = asyncHandler(
    async (req: Request, res: Response) => {
        const { fullname, email, username, password } =  req.body
        console.log(req.body);
        if(!fullname || !email || !username || !password){
            throw new ApiError(403, "all fields are required") 
        }

        const existedUser = await User.findOne({
            $or: [{username}, {email}]
        })
        // console.log((req.files as { [fieldname: string]: Express.Multer.File[] })?.avatar[0].path);

        const avatarPath = (req.files as { [fieldname: string]: Express.Multer.File[] })?.avatar[0].path;
        // console.log(avatarPath)
        // const coverPath = req.files?.cover[0]?.path;
        if(!avatarPath){
            throw new ApiError(400, 'file upload krdo')
        }
        if(existedUser){
            try {
                fs.unlinkSync(avatarPath);
                console.log('File deleted successfully');
            } catch (err) {
                console.error('Error deleting file:', err);
            }
            return res.status(409).json(new ApiResponse(409, "user already exists"))
        }

        const avatar = await uploadtoCloudinary(avatarPath)
        if(!avatar){
            try {
                fs.unlinkSync(avatarPath);
                console.log('File deleted successfully');
            } catch (err) {
                console.error('Error deleting file:', err);
            }
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

const loginUser = asyncHandler(
    async (req: Request, res: Response) => {
        // require: username / email, password
        // check if username / email exist
        // compare pass to value stored
        // if not match, return error
        // else return access, refresh tokens
        const { username, email, password }: {
            username?: string,
            email?: string, 
            password: string
        } = req.body;
        console.log(req.body)
        if(!username && !email){
            throw new ApiError(401, "credentials are invalid");
        }
        const user = await User.findOne({
            $or: [{username}, {email}]
        })
        if(!user){
            throw new ApiError(401, "user not found");
        }
        const isPasswordValid = await user.isSamePassword(password);
        if(!isPasswordValid){
            throw new ApiError(401, "passwords dont match");
        }
        const {accessToken, refreshToken} = await generateAccessandRefreshToken(user);
        const options = {
            httpOnly: true,
            secure: true // bas server edit kr skta
        }
        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {refreshToken, accessToken}, "user logged in successfully!"));


    }
)

const logoutUser = asyncHandler(
    async (req: Request, res: Response) => {
        // validate JWT
        // delete refreshToken
        const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.refreshToken;
        const dbID = jwt.decode(token);
        const user = await User.findById(dbID);
        user.refreshToken = undefined;
        await user.save();
        const options = {
            secure: true,
            httpOnly: true
        }
        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            message: "you logged out successfully"
        })
    }
)

const refreshAccessToken = asyncHandler(
    async (req: Request, res: Response) => {
        const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.refreshToken;
        const user = jwt.decode(token);
        const userDetails = await User.findById(user);
        if(userDetails.refreshToken !== token){
            return res.status(401).json({
                message: "invalid token"
            })
        }
        const options = {
            httpOnly: true,
            secure: true // bas server edit kr skta
        }
        const {accessToken, refreshToken} = await generateAccessandRefreshToken(userDetails);
        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            refreshToken, accessToken, message: "success"
        })
    }
)


export {registerUser, loginUser, logoutUser, refreshAccessToken}
