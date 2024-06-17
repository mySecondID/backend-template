import { Request, Response, NextFunction } from 'express';

// const asyncHandler = fn => 
//     async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             await fn(req, res, next)
//         }
//         catch (err: any){
//             res.status(err.code || 500).json({
//                 success: false,
//                 message: err.message
//             })
//         }
//     }

type RequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const asyncHandler: any = (reqHandler: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(reqHandler(req, res, next))
        .catch(err => next(err)) 
    }
}

export {asyncHandler}