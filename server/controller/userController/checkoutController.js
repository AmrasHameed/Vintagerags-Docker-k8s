const userModel=require('../../model/userModel')
const cartModel=require('../../model/cartModel')
const productModel=require('../../model/productModel')
const addressModel=require('../../model/addressModel')
const catModel=require('../../model/categModel')



const checkout=async(req,res)=>{
    try{
        const userId=req.session.userId;
        const categories=await catModel.find()
        const address=await addressModel.findOne({userId})
        const data=await cartModel.findOne({userId}).populate({
            path:'item.productId',
            select:'name'
        })  
        for(const cartItem of data.item||[]){
            const pro=cartItem.productId;
            const product=await productModel.findOne({_id:pro._id})
            const size=product.stock.findIndex(s=>s.size==cartItem.size);
            if(product.stock[size].quantity<cartItem.quantity){
                console.log('Selected quantity exceeds available stock for productId:', product._id);
                return res.redirect('/cart');
            }
        }
        if (data.item.length == 0) {
            return res.redirect('/cart')
        }
        res.render('user/checkout',{data,address,categories})
    }catch(error){
        console.error("Error updating cart quantity:", error);
        res.redirect("/error");
    }
}

const checkoutreload=async(req,res)=>{
    try{

    }catch(error){
        console.error("Error updating cart quantity:", error);
        res.redirect("/error");
    }
}

module.exports={checkout,checkoutreload}