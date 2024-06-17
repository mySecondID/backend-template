import { Request, Response } from 'express'
import {asyncHandler} from '../utils/asyncHandler'

const registerUser = asyncHandler(
    async (req: Request, res: Response) => {
        return res.json({
            message: "ok"
        })
    }
)

export {registerUser}