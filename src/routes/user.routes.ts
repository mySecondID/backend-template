import { Router } from "express";
import { registerUser } from "../controllers/user.controller";

const userRouter = Router()

userRouter.route('/register').get(registerUser)


export {userRouter}