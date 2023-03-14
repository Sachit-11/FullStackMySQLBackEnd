import express from "express";
import upload from "../utils/multer.js";
import {getAllBooks, autoSuggestBy, getBookByID, getBooksByFilters, addBook, updateBook, deleteBook} from "../controller/bookController.js";

const router = express.Router();

// router.route("/books").get(getAllBooks);

router.route("/books/suggest/:by").get(autoSuggestBy);

router.route("/books/search").get(getBooksByFilters);

// Should be at last as :id will match everything
router.route("/books/:id").get(getBookByID);

// Best way is to combine routes and check if book exist if it does not then add else update, also don't use frontend variables to decide backend code as done below due to security issues although as our case is simple so it doesn't matter

// Multer adds a body object and a file or files object to the request object

router.route("/books/add").post(upload.single('cover'), addBook);

router.route("/books/:id").put(upload.single('cover'), updateBook);

router.route("/books/:id").delete(deleteBook);

export default router;