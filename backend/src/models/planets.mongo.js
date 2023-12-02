const mongoose = require("mongoose");

planetsSchema = new mongoose.Schema({
    kepler_name: {
        type:String,
        required:true
    }
});

module.exports = mongoose.model("Planet", planetsSchema);