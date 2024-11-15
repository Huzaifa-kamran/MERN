const mongoose = require("mongoose");

const CategoryModel = mongoose.Schema({
    catName:{
        type:String,
        required: true
    }
});

const category = mongoose.model("categories", CategoryModel);

module.exports = category;