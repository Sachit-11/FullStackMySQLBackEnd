import multer from "multer";

/* This was for the case when we wanted to store files in our local storage i.e inside public/uploads folder

import path from "path";
import {fileURLToPath} from 'url';

const filename = fileURLToPath(import.meta.url);
let dirname = path.dirname(filename);
// moving one folder up
dirname = path.join(dirname, "../");
const DIR = path.join(dirname, '/public/uploads');

var storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, DIR)
    },
    
    filename: function (req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

router.use('/uploads', express.static(dirname + '/public/uploads'));

*/

const storage = multer.diskStorage({});
const maxsize = 2 * 1024 * 1024; // 2 MB
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/webp"){
            cb(null, true);
        }
        else{
            req.isFileFormatInvalid = true;
            cb(null, false);
        }
    },
    limits: {fileSize : maxsize}
});

export default upload;