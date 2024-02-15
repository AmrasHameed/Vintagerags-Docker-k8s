const userModel=require('../../model/userModel')

const index= async (req,res)=>{
    try{
        res.render('user/index')
    }catch(error){
        console.log(error)
    }
}
// const cart= async (req,res)=>{
//     try{
//         res.render('user/cart')
//     }catch(error){
//         console.log(error)
//     }
// }
const shop= async (req,res)=>{
    try{
        res.render('user/shop')
    }catch(error){
        console.log(error)
    }
}
const contact= async (req,res)=>{
    try{
        res.render('user/contact')
    }catch(error){
        console.log(error)
    }
}
const shopSingle= async (req,res)=>{
    try{
        res.render('user/shop-single')
    }catch(error){
        console.log(error)
    }
}
const login= async (req,res)=>{
    try{
        res.render('user/login')
    }catch(error){
        console.log(error)
    }
}
const signup= async (req,res)=>{
    try{
        res.render('user/signup')
    }catch(error){
        console.log(error)
    }
}
module.exports={index,shop,contact,shopSingle,login,signup};