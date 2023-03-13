import { db } from "../index.js";
import cloudinary from "../utils/cloudinary.js";
import {extname} from "path";

const getAllBooks = (req, res) => {
    const q = "Select * from books";
    db.query(q, (err, data) => {
        if (err){
            return res.json(err);
        }
        return res.json(data);
    })
}

const autoSuggestBy = (req, res) => {
    const by = req.params.by;
    const s = req.query.currSearch.toLowerCase();
    let q;
    if (by == "title"){
        q = "Select `title` from books order by `title`";
    }
    else{
        q = "Select `author` from books order by `author`";
    }
    
    db.query(q, (err, data) => {
        if (err){
            return res.json(err);
        }

        // ranked dict
        let rankedDict = new Map();

        for (let i = 0; i < data.length; i++){
            const t = data[i][by];
            const index = (t.toLowerCase()).indexOf(s);
            if (index !== -1){
                if (rankedDict.has(index)){
                    rankedDict.set(index, [...rankedDict.get(index), t]);
                }
                else{
                    rankedDict.set(index, [t]);
                }
            }
        }

        rankedDict = Array.from(rankedDict).sort((a, b) => { return a[0] - b[0]} );

        const suggestions = new Set();
        for (const item of rankedDict){
            for (const x of item[1]){
                suggestions.add(x);
                if (suggestions.length == 5){
                    break;
                }
            }
            if (suggestions.length == 5){
                break;
            }
        }
        
        return res.json(Array.from(suggestions));
    })
}

const getBooksByFilters = (req, res) => {
    let q = "Select * from books where 1=1 ";

    const queries = req.query;
    const values = [];

    if ("minPrice" in queries){
        q += "and `price` >= ? ";
        values.push(Number(queries['minPrice']));
    }
    
    if ("maxPrice" in queries){
        q += "and `price` <= ? ";
        values.push(Number(queries['maxPrice']));
    }

    if ("title" in queries){
        q += "and `title` like ";
        q += `'%${queries['title']}%' `;
    }

    if ("author" in queries){
        q += "and `author` like ";
        q += `'%${queries['author']}%' `;
    }

    if ("sort" in queries){
        q += "order by ";
        const arr = queries['sort'].split(",");
        q += "`" + arr[0] + "` ";
        q += arr[1];
    }
    
    db.query(q, values, (err, data) => {
        if (err){
            return res.json(err);
        }
        return res.json(data);
    })
}

// Should be at last as :id will match everything
const getBookByID =  (req, res) => {
    const bookId = req.params.id;
    const q = "select * from books where id = ?";
    
    db.query(q, bookId, (err, data) => {
        if (err){
            return res.json(err);
        }
        return res.json(data);
    })
}

// Best way is to combine routes and check if book exist if it does not then add else update, also don't use frontend variables to decide backend code as done below due to security issues although as our case is simple so it doesn't matter

// Multer adds a body object and a file or files object to the request object

const addBook = async (req, res) => {

    if (req.isFileFormatInvalid){
        return res.status(500).json({
            message : "Invalid File Format"
        })
    }
    
    let result = "";
    if (req.file){
        result = await cloudinary.uploader.upload(req.file.path, {folder: "BookCovers", public_id: Date.now() + extname(req.file.originalname)});
    }
    
    const q = "insert into books (`title`, `author`, `desc`, `price`, `cover`) Values (?)";
    
    const values = [
        req.body.title,
        req.body.author,
        req.body.desc,
        req.body.price,
        result?.url,
    ];
    
    // we have to do [values] because we need to pass the values array
    db.query(q, [values], (err, data) => {
        if (err){
            return res.json(err);
        }
        return res.json("Book has been created successfully");
    })
}

const updateBook = async (req, res) => {
    if (req.isFileFormatInvalid){
        return res.status(500).json({
            message : "Invalid File Format"
        })
    }

    let result = "";
    if (req.file){
        result = await cloudinary.uploader.upload(req.file.path, {folder: "BookCovers", public_id: Date.now() + extname(req.file.originalname)});
    }
    
    const q = "update books set `title` = ?, `author` = ?, `desc` = ?, `price` = ?, `cover` = ? where id = ?";
    
    const values = [
        req.body.title,
        req.body.author,
        req.body.desc,
        req.body.price,
        result ? result.url : req.body.cover,
        req.params.id,
    ];
    
    db.query(q, values, (err, data) => {
        if (err){
            return res.json(err);
        }
        return res.json("Book has been updated successfully");
    })

}

const deleteBook = (req, res) => {
    const bookId = req.params.id;
    const q = "delete from books where id = ?";
    
    db.query(q, bookId, (err, data) => {
        if (err){
            return res.json(err);
        }
        return res.json("Book has been deleted successfully");
    })
}

export {getAllBooks, autoSuggestBy, getBooksByFilters, getBookByID, addBook, updateBook, deleteBook};