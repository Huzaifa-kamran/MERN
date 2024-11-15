const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Middlewares 
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors({
   origin: 'http://localhost:3000', 
   credentials: true                
}));


// connection with mongo db atlass
const {connectionDB} = require("./Config/ConnectionDB");

// Controllers 
const {UserRegister,UserLogin,UserGet} = require("./Controllers/UserAuth");
const {getTodo,createTodo,updateTodo,deleteTodo,updateGet,getCategory} = require("./Controllers/Todo");


// Routes
app.route("/").post(UserRegister);
app.route("/login").post(UserLogin);

app.route("/todo").post(createTodo);
app.route("/update/:id").get(updateGet);
app.route("/user/:id").get(UserGet);
app.route("/todo/:id").put(updateTodo).delete(deleteTodo).get(getTodo);

app.route("/category").get(getCategory);

// Start server
app.listen(process.env.PORT,function(){
   console.log(`Server is running on ${process.env.PORT}`);
   connectionDB();
});