import express from "express";
import mysql2 from "mysql2";
import dotenv from "dotenv";
import cors from "cors";
import bookRoutes from "./routes/bookRoutes.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);
__dirname = join(__dirname, "/config/config.env");

// Config
dotenv.config({path: __dirname});

const app = express();

// This middleware allows us to send json file from any client
app.use(express.json());
// This middleware allows other website to fetch data, make requests
app.use(cors());

export const db = mysql2.createConnection({
    host: "containers-us-west-152.railway.app",
    port: 6881,
    user: "root",
    password: `${process.env.PASSWORD}`,
    database: "railway",
    multipleStatements: true
})

// export const db = mysql2.createConnection({
//     host: "localhost",
//     user: "root",
//     password: `${process.env.PASSWORD_SQL}`,
//     database: "test",
//     multipleStatements: true
// })

db.connect((err) => {
    if (err){
        console.log(err);
    }
    console.log("db connected");
    
    // creating the table
    let q = "create table if not exists books(`id` int not null auto_increment, `title` VARCHAR(45) NOT NULL, `author` text, `desc` text NULL, `price` INT NOT NULL, `cover` text NULL, primary key(`id`)); ";
    
    q += "create table if not exists users(`userid` int not null, `username` text not null, `email` text not null, `password` text not null, primary key(`userid`)); ";
    
    db.query(q, (err, data) => {
        if (err){
            return console.log(err);
        }
        console.log("Tables created successfully");
    })
})

app.get("/", (req, res) => {
    res.json("hello this is the backend")
})

// Book Routes
app.use("", bookRoutes);

app.post("/books", (req, res) => {
    const q = "Select * from books";
    db.query(q, (err, data) => {
        if (err){
            return res.json(err);
        }
        return res.json(data);
    })
})

// User Routes

// To check default server (on which it is currently running) we are using server.address()
// app.listen() defines the port that acts as an interface bw actual server and frontend
// process.env.PORT has some default value when hosting on sites like railway.app or heroku
var server = app.listen(process.env.PORT, () => {
    console.log(server.address());
    console.log("Connected to backend!");
})