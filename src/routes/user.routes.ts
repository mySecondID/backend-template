import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller";
import { upload } from '../middlewares/multer.middleware'
import { verifyJWT } from "../middlewares/auth.middleware";

const userRouter = Router()

userRouter.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "cover",
            maxCount: 1
        }
    ]), 
    registerUser
)

userRouter.post('/login', upload.fields([]), loginUser);
userRouter.post('/logout', verifyJWT, logoutUser);
userRouter.post('/refreshToken', refreshAccessToken);


export {userRouter}