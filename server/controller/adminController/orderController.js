const productModel=require('../../model/productModel')
const orderModel=require('../../model/orderModel')


const order=async(req,res)=>{
    try{
        const order = await orderModel.find({}).sort({ createdAt: -1 }).populate({
            path: 'items.productId',
            select: 'name'
        })
        res.render("admin/order", { order: order })
    }catch(error){
        console.log(error);
        res.render("user/serverError");
    }
}

const orderstatus=async(req,res)=>{
    try{
        const { orderId, status } = req.body
        const updateOrder = await orderModel.updateOne({ _id: orderId }, { status: status, updated: new Date() })
        res.redirect('/admin/orders')
    }catch(error){
        console.log(error);
        res.render("user/serverError");
    }
}

module.exports={order,orderstatus}