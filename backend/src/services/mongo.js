const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGO_URI;


mongoose.connection.once("open", ()=>{
    console.log("Datbase connected!");

})
mongoose.connection.on("error", (err)=>{
    console.error(`Connection refused ${err}`);
})

async function mongoConnect(){
    mongoose.connect(uri);

}

async function mongoDisconnect(){
    mongoose.disconnect();
}

module.exports = {mongoConnect, mongoDisconnect}