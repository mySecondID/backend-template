import dotenv from 'dotenv'
import connectDB from './db'
import { app } from './app'

dotenv.config({
    path: ['.env']
})

connectDB()
.then(res => {
        app.listen(8000, () => {
            console.log("Server is listening");
        })
    }
)
.catch(err => {
    console.log("err in db", err);
})

