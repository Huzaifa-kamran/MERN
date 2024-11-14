const mongoose = require("mongoose");
const todos = require("../Models/TodoModel");

// @METHOD    GET 
// @API       http://localhost:5000/todo
const getTodo = async(req, res) =>{
  try {
    console.log(req.params.id)
    const todosList = await todos.find({userId:req.params.id});
    console.log(todosList);
    return res.status(200).send(todosList);
  } catch (error) {
    return res.send({"error": error.message});
  }
}
// @METHOD    POST 
// @API       http://localhost:5000/todo
const createTodo = async(req, res) => {
    try {

  const {todoName,todoCat,todoDate = Date.now(),userId} = req.body;

  if(!todoName){
    return res.status(400).send({"error": "Please enter a todo name"});
  }
  if(!todoCat){
    return res.status(400).send({"error": "Please select todo category"});
  }
  const formattedDate = new Date(todoDate).toISOString().split("T")[0];
  const todo = await todos.create({
    todoName:todoName,
    todoCat:todoCat,
    todoDate:formattedDate,
    userId: userId,
  });

  if(todo){
    return res.status(201).send({"message":"Todo added successfully"});
}else{
    return res.status(500).send({"error":"Failed to add todo "});
}
} catch (error) {
    return res.send({"error": error.message});
}

}

// @METHOD    UPDATE 
// @API       http://localhost:5000/todo/:id
const updateTodo = async(req, res) => {
    try {

        const {todoName,todoCat,todoDate = Date.now(),userId} = req.body;
        const id = req.params.id;

        if(!todoName){
            return res.status(400).send({"error": "Please enter a todo name"});
          }
          if(!todoCat){
            return res.status(400).send({"error": "Please select todo category"});
          }

          const existingTodo = await todos.findOne({_id:id});
          if(!existingTodo){
            return res.status(404).send({"error": "Todo not found"});
          }
          const formattedDate = new Date(todoDate).toISOString().split("T")[0];
          const modifiedTodo = {
            todoName:todoName,
            todoCat:todoCat,
            todoDate:formattedDate,
            userId: userId,
          }
          
          const updateTodo = await todos.updateOne({"_id":existingTodo._id},{$set:modifiedTodo});

          if (updateTodo) {
              return res.status(200).send({"message":"Todo updated successfully"});
          } else {
            return res.status(404).send({"message":"error while updating Todo"});
          }

    } catch (error) {
        return res.send({"error": error.message});
    }
}

// @METHOD    DELETE 
// @API       http://localhost:5000/todo/:id
const deleteTodo =async(req, res) => {
    try {
        const id = req.params.id;
        const existingTodo = await todos.findOne({_id:id});
        if(!existingTodo){
            return res.status(404).send({"error": "Todo not found"});
          }
        const deleteTodo = await todos.deleteOne({_id:id});
        if (deleteTodo) {
            return res.send({"message":"Todo deleted successfully"});
        } else {
            return res.send({"error": "Error deleting Todo"});
        }
    } catch (error) {
        return res.send({"error": error.message});
    }
}


// @METHOD    GET 
// @API       http://localhost:5000/update
const updateGet = async (req, res) => {
  try {
    console.log("Fetching todo with ID:", req.params.id); // Log the ID for verification
    const todo = await todos.findOne({ _id: req.params.id });
    
    if (!todo) {
      return res.status(404).send({ error: "Todo not found" });
    }
    
    console.log("Success:", todo);
    return res.status(200).send(todo);
  } catch (error) {
    console.error("Error fetching todo:", error);
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {getTodo,createTodo,updateTodo,deleteTodo,updateGet}