const userModel = require('../../model/userModel')
const cartModel = require('../../model/cartModel')
const productModel = require('../../model/productModel')
const addressModel = require('../../model/addressModel')
const orderModel = require('../../model/orderModel')
const catModel = require('../../model/categModel')
const bcrypt = require('bcrypt') 
const flash = require('express-flash')

const order = async (req, res) => {
    try {
        const categories = await catModel.find()
        const userId = req.session.userId;
        const order = await orderModel.find({ userId: userId }).sort({ createdAt: -1 }).populate({
            path: 'items.productId',
            select: 'name image'
        })
        res.render('user/orders', { orders: order, categories })
    } catch (error) {
        console.log(error)
        res.render('user/serverError')
    }
}

const ordercancelling = async (req, res) => {
    try {
        const id = req.params.id
        const update = await orderModel.updateOne({ _id: id }, { status: "Cancelled", updated: new Date() })
        const result = await orderModel.findOne({ _id: id })
        const items = result.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,

        }))

        for (const item of items) {
            const product = await productModel.findOne({ _id: item.productId })

            const size = product.stock.findIndex(size => size.size == item.size)
            product.stock[size].quantity += item.quantity
            await product.save()
        }
        res.redirect("/orders")
    } catch (error) {
        console.log(error)
        res.render('user/serverError')
    }
}
const ordertracking = async (req, res) => {
    try {
        const id = req.params.id
        const categories = await catModel.find()
        const order = await orderModel.find({ _id: id }).populate({
            path: 'items.productId',
            select: 'name images'
        })
        console.log('kkk', order, 'jjjj');
        res.render('user/ordertracking', { order: order, categories })
    } catch (error) {
        console.log(error)
        res.render('user/serverError')
    }
}

const resetPassword = async (req, res) => {
    try {
        const categories=await catModel.find()
        const pass=req.flash('pass')
        res.render('user/resetpassword', { pass,categories })
    } catch (error) {
        console.log(error)
        res.render('user/serverError')
    }
}

const updatePassword = async (req, res) => {
    try {
        const { pass, npass, cpass } = req.body
        const userId = req.session.userId
        const user = await userModel.findOne({ _id: userId })
        const isPassword = await bcrypt.compare(npass, user.password)
        if(isPassword){
            req.flash('pass','Enter Different Password')
            return res.redirect('/resetpassword');
        }
        if(npass!==cpass){
            req.flash('pass','Passwords do not match')
            return res.redirect('/resetpassword');
        }
        const passwordmatch = await bcrypt.compare(pass, user.password)
        if (passwordmatch) {
            const hashedpassword = await bcrypt.hash(npass, 10)
            const newuser = await userModel.updateOne({ _id: userId }, { password: hashedpassword })
            console.log("password updated");
            req.flash("success", "Password updated successfully!");
            return res.redirect('/profile')

        }
        else {
            req.flash("pass", "Invalid Password");
            return res.redirect('/resetpassword');
        }

    } catch (error) {
        console.log(error)
        res.render('user/serverError')
    }
}

const showaddress=async (req,res)=>{
    try{
        const userId = req.session.userId
        const categories=await catModel.find()
        const data = await addressModel.findOne({ userId: userId })
        res.render('user/address', { userData: data ,categories})
    }catch(error){
        console.log(error)
        res.render('user/serverError')
    }
}

const editAddress=async(req,res)=>{
    try{
        const userId = req.session.userId
        const categories=await catModel.find()
        const id = req.params.id
        const address = await addressModel.findOne({ userId: userId, 'address._id': id })
        res.render('user/editAddress', { adress: address ,categories})
    }catch(error){
        console.log(error)
        res.render('user/serverError')
    }
}

const deleteAddress=async(req,res)=>{
    try{
        const userId = req.session.userId;
        const id = req.params.id;
        const result = await addressModel.updateOne(
            { userId: userId, 'address._id': id },
            { $pull: { address: { _id: id } } }
        );
        res.redirect('/address');
    }catch(error){
        console.log(error)
        res.render('user/serverError')
    }
}

const addressPost=async(req,res)=>{
    try{
        const { name, mobile, housename, street, city, state, country, pincode, saveas } = req.body;
        const addressId = req.params.id
        const userId = req.session.userId;

        const isAddressExists = await addressModel.findOne({
            'userId': userId,
            'address': {
                $elemMatch: {
                    '_id': { $ne: addressId },
                    'save_as': saveas,
                    'name': name,
                    'mobile': mobile,
                    'housename': housename,
                    'street': street,
                    'pincode': pincode,
                    'city': city,
                    'state': state,
                    'country': country,

                }
            }
        });

        if (isAddressExists) {
            return res.status(400).send('Address already exists');
        }
        const result = await addressModel.updateOne(
            { 'userId': userId, 'address._id': addressId },
            {
                $set: {
                    'address.$.save_as': saveas,
                    'address.$.name': name,
                    'address.$.mobile': mobile,
                    'address.$.housename': housename,
                    'address.$.street': street,
                    'address.$.pincode': pincode,
                    'address.$.city': city,
                    'address.$.state': state,
                    'address.$.country': country,

                }
            }
        );

        res.redirect('/address');
    }catch(error){
        console.log(error)
        res.render('user/serverError')
    }
}


const addAddress=async(req,res)=>{
    try{
        const categories=await catModel.find()
        res.render('user/addAddress',{categories})
    }catch(error){
        console.log(error)
        res.render('user/serverError')
    }
}

const addaddressPost=async(req,res)=>{
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
                if(req.session.checkoutSave){
                    return res.redirect(`/checkout`)
                }
                return res.redirect(`/address`)
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
            if(req.session.checkoutSave){
                return res.redirect(`/checkout`)
            }
            return res.redirect('/address');
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
        if(req.session.checkoutSave){
            res.redirect(`/checkout`)
        }
        res.redirect('/address');
    }catch(error){
        console.log(error)
        res.render('user/serverError')
    }
}

module.exports = { order, ordercancelling, ordertracking, resetPassword, updatePassword ,showaddress ,editAddress,deleteAddress,addressPost,addAddress,addaddressPost}