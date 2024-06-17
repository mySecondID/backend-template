import mongoose from "mongoose"
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2' 
import bcrypt from 'bcrypt-updated'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true
    }
},
{
    timestamps: true
}
)

userSchema.plugin(mongooseAggregatePaginate)

userSchema.pre("save", async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

userSchema.methods.isSamePassword = async function (password: string){
    return bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            email: this.email,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY!
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            email: this.email,
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY!
        }
    )
}