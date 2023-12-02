const express = require("express");
const cors = require("cors");
const path = require("path");
const api = require("./routes/api")
const helmet = require("helmet");


const app = express();

//MIDLLEWARES
app.use(helmet());
app.use(cors({
    origin: "http://localhost:3000"
}))
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use("/v1", api);

// frontend files
app.use(express.static(path.join(__dirname, "..", "public")));

//Routers
app.get("/*", (req, res) =>{
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
})


//Exports
module.exports = app;