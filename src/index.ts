import dotenv from 'dotenv'
import connectDB from './db'
import { app } from './app'
import { v2 as cloudinary } from 'cloudinary';


dotenv.config({
    path: ['./.env']
})

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
const api_key = process.env.CLOUDINARY_CLOUD_API_KEY
const api_secret = process.env.CLOUDINARY_CLOUD_PASSWORD



cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
});


connectDB()
.then(
    res => {
        app.listen(8000, () => {
            console.log("Server is listening");
        })
    }
)
.catch(err => {
    console.log("err in db", err);
})

