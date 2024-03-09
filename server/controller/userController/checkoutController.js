const userModel=require('../../model/userModel')
const cartModel=require('../../model/cartModel')
const productModel=require('../../model/productModel')
const addressModel=require('../../model/addressModel')
const orderModel=require('../../model/orderModel')
const catModel=require('../../model/categModel')



const checkout=async(req,res)=>{
    try{
        const userId=req.session.userId;
        const categories=await catModel.find()
        const address=await addressModel.findOne({userId:userId})
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
        console.log(error);
        res.render("user/serverError");
    }
}

const checkoutreload=async(req,res)=>{
    try{
        const { name, mobile, email, housename, street, city, state, country, pincode, saveas } = req.body;
        const userId = req.session.userId;
        const existingUser = await addressModel.findOne({ userId: userId });

        if (existingUser) {
            const existingAddress = await addressModel.findOne({
                'userId': userId,
                'address.name': name,
                'address.mobile': mobile,
                'address.email': email,
                'address.housename': housename,
                'address.street': street,
                'address.city': city,
                'address.state': state,
                'address.country': country,
                'address.pincode': pincode,
                'address.save_as': saveas
            });

            if (existingAddress) {
                return res.redirect(`/checkout`)
            }

            existingUser.address.push({
                name: name,
                mobile: mobile,
                email: email,
                housename: housename,
                street: street,
                city: city,
                state: state,
                country: country,
                pincode: pincode,
                save_as: saveas
            });

            await existingUser.save();

            return res.redirect('/checkout');
        }

        const newAddress = await addressModel.create({
            userId: userId,
            address: {
                name: name,
                mobile: mobile,
                email: email,
                housename: housename,
                street: street,
                city: city,
                state: state,
                country: country,
                pincode: pincode,
                save_as: saveas,
            },
        });

        res.redirect('/checkout');
    }catch(error){
        console.log(error);
        res.render("user/serverError");
    }
}

const order=async(req,res)=>{
    try{
        const categories=await catModel.find()
        const {address,pay}=req.body
        console.log(address,pay);
        const userId=req.session.userId;
        const cart=await cartModel.findOne({userId:userId})
        const useraddress = await addressModel.findOne({ userId: userId })
        const selectedaddress = useraddress.address[address]
        const items = cart.item.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            price: item.price,
        }))
        for(const item of items){
            const product=await productModel.findOne({_id:item.productId})
            const size=product.stock.findIndex(size=>size.size==item.size)
            product.stock[size].quantity-=item.quantity
            await product.save()
        }
        const order=new orderModel({
            userId:userId,
            items:items,
            payment:pay,
            address:selectedaddress,
            createdAt: new Date(),
            updated:new Date()
        })
        cart.item=[]
        cart.total=0
        const savedOrder=await order.save()
        await cart.save()
        const orderconfirmation = await orderModel.findOne({ orderId: savedOrder.orderId }).populate({
            path: 'items.productId',
            select: 'name'
        })
        res.render('user/thankyou.ejs',{order:orderconfirmation,categories})
    }catch(error){
        console.log(error);
        res.render("user/serverError");
    }
}

module.exports={checkout,checkoutreload,order}