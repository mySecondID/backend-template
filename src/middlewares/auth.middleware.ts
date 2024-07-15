import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import User from '../models/user.model';

export const verifyJWT = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.refreshToken;
        const response = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
        console.log(token, response);
        if(!response){
            throw new ApiError(401, "invalid token");
        }
        const dbID = jwt.decode(token);
        const user = await User.findById(dbID);
        if(!user){
            throw new ApiError(401, "user not found");
        }
        req.body.user = dbID;
        next();
    }
)