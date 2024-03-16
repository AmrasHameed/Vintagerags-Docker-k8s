const couponModel=require('../../model/couponModel')
const flash=require('express-flash')

const couponlist=async(req,res)=>{
    try{
        const coupons=await couponModel.find({})
        res.render('admin/couponList',{coupons})

    }
    catch(err){
        console.log(err);
        res.render("users/serverError");

    }
}

const addcouponpage=async(req,res)=>{
    try{
        res.render('admin/addCoupon')
    }
    catch(err){
        console.log(err);
        res.render("users/serverError");

    }
}

module.exports={couponlist,addcouponpage}