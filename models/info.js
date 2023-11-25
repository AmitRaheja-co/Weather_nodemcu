require("../config/mongoose");
const mongoose = require('mongoose');
const infoSchema = new mongoose.Schema({
    city: {
        type: String       
    },
    weather: {
        type: String
    }
});
const info = mongoose.model('info',infoSchema);
module.exports = info;