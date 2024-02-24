const productModel = require('../../model/productModel')
const path=require('path')


const product = async (req, res) => {
    try {
        const productSuccess = req.flash('productSuccess') || [];
        const products = await productModel.find().exec();
        res.render('admin/products', { product: products, productSuccess });
    } catch (error) {
        console.log(error);
        res.render("user/serverError");
    }
};

const addProduct = async (req, res) => {
    try {
        res.render('admin/addProduct')
    } catch (err) {
        console.log(err);
        res.render("user/serverError");
    }
}

const addProductPost = (req, res) => {
    try {
        const product = new productModel({
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            image: req.files.map(file => file.path),
        })
        product.save()
        req.flash('productSuccess', "Product Added Successfully")
        res.redirect('/admin/products')
    } catch (error) {
        console.log(error);
        res.render("user/serverError");
    }
}
const unlist= async(req,res)=>{
    try{
        const id= req.params.id;
        const product= await productModel.findById(id);
        product.status= !product.status;
        await product.save();
        res.redirect('/admin/products')
    }catch(err){
        console.log(err);
        res.render("user/serverError");
    }
}

updateProduct=async (req,res)=>{
    try{
        const id=req.params.id;
        const product= await productModel.findById(id);
        res.render('admin/updateProduct',{product})
    }catch(err){
        console.log(err);
        res.render("user/serverError");
    }
}

module.exports = { product, addProduct, addProductPost,unlist,updateProduct}