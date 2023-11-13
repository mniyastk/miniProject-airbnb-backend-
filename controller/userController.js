const users =require('../model/userModel');

///user registration controller ///

const userRegistration= async(req,res)=>{
    // console.log(req.body.userData);
const {firstName,lastName,password,email,phone}=req.body.userData;


const user = await users.create({
    firstName,
    lastName,
    password,
    email,
    phone
})
res.send(user)

}
const userLogin=async(req,res)=>{
    const {email,password}=req.body
    console.log(req.body)
    const out =await users.findOne({email})
    if(out.password===password){
        res.send("login success")}
    


    console.log(out)
}
const fetchData= async(req,res)=>{
    const result= await users.find()
    res.send(result)
    console.log(result)
}
module.exports={userRegistration,userLogin,fetchData}