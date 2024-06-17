import mongoose from 'mongoose';

const connectDB = async () => {
    try{
        const instance = await mongoose.connect(process.env.DATABASE_URL!);
        // console.log(process.env)
        console.log("db connected");
    }catch(err){
        console.log("not able to connect db: ", err)
    }
}

export default connectDB