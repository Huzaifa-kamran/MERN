const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserAccount = require("../Models/UserRegister")


// @METHOD    POST 
// @API       http://localhost:5000/
const UserRegister = async(req,res)=>{
    try { 
    const {userName,userEmail,userAge,userPassword} = req.body;
console.log(req.body)
     // Username: allows alphabets only
     const userNameRegex = /^[a-zA-Z]+( [a-zA-Z]+)*$/;

       // Email: standard email format
       const userEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
     
    //  Validations 
     if(!userNameRegex.test(userName)){
        return res.status(400).send({"error":"User name can contain only letters"});
     }
// console.log(userEmail)
     if(!userEmailRegex.test(userEmail)){
        return res.status(400).send({"error":"Invalid email address"});
     }

     if(userAge < 18){
        return res.status(400).send({"error":"User age must be at least 18"});
     }
     if(userPassword.length < 8){
        return res.status(400).send({"error":"Password must be at least 8 characters"});
     }
  

   // Check Existing User name and email
   const existingName = await UserAccount.findOne({ userName: userName });
   const existingEmail = await UserAccount.findOne({ userEmail: userEmail });
     if(existingName){
        return res.status(400).send({"error":"User name already exists"});
     }
     if(existingEmail){
        return res.status(400).send({"error":"Email already exists"});
     }

     // Hash Password
     const hashedPassword = await bcrypt.hash(userPassword,10);
     const user = await UserAccount.create({
       userName: userName,
       userEmail: userEmail,
       userAge: userAge,
       userPassword: hashedPassword
     });

     if(user){
        return res.status(201).send({"message":"User registered successfully"});
    }else{
        return res.status(500).send({"error":"Failed to register user"});
    }


  
} catch (error) {
    return res.send({"error":error.message})
}

}

// @METHOD    POST 
// @API       http://localhost:5000/login 
const UserLogin = async(req,res)=>{
    const {userName,userPassword} = req.body;

    if(!userName ||!userPassword){
        return res.status(400).send({"error":"User name and password are required"});
    }
 
    const user = await UserAccount.findOne({ userName: userName });
    if(!user){
        return res.status(404).send({"error":"Invalid credentials"});
    }

    const validPassword = await bcrypt.compare(userPassword, user.userPassword);
    if(!validPassword){
        return res.status(404).send({"error":"Invalid credentials"});
    }
    const token = jwt.sign({id: user._id}, process.env.TOKEN_SECRET, {expiresIn: '35m'});
    return res.status(200).send({
        message: "Login Successful",
        token: token,  
      });
}


// @METHOD    POST 
// @API       http://localhost:5000/user/:id
const UserGet = async(req, res) =>{
    try {
        console.log("Fetching user with ID:", req.params.id); // Log the ID for verification
        const user = await UserAccount.findOne({ _id: req.params.id });
        
        if (!user) {
          return res.status(404).send({ error: "user not found" });
        }
        
        console.log("Success:", user);
        return res.status(200).send(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).send({ error: error.message });
      }
}
module.exports = {UserRegister,UserLogin,UserGet}