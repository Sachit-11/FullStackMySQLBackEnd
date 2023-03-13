import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);
__dirname = join(__dirname, "../config/config.env");

dotenv.config({path: __dirname});

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});

export default cloudinary;