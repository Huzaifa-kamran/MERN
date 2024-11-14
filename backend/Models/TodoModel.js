const mongoose = require("mongoose");

const TodoModel = mongoose.Schema({
    todoName:{
        type:String,
        required: true
    },
    todoCat:{
        type:String,
        required: true
    },
    todoDate:{
        type:Date,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAccount"
    }
});

const todos = mongoose.model("todos", TodoModel);

module.exports = todos;