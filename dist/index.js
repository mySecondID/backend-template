"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
const app_1 = require("./app");
const cloudinary_1 = require("cloudinary");
dotenv_1.default.config({
    path: ['./.env']
});
const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_CLOUD_API_KEY;
const api_secret = process.env.CLOUDINARY_CLOUD_PASSWORD;
cloudinary_1.v2.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
});
(0, db_1.default)()
    .then(res => {
    app_1.app.listen(8000, () => {
        console.log("Server is listening");
    });
})
    .catch(err => {
    console.log("err in db", err);
});
