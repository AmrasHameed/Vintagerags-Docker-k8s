const productModel=require('../../model/productModel')


const product= async(req,res)=>{
    try{
        const products= await productModel.find()
        res.render('admin/products',{product:products})

    }catch(error){
        console.log(error);
        res.render("user/serverError");
    }
}

const addProduct= async(req,res)=>{
    try{
        res.render('admin/addProduct')
    }catch(err){
        console.log(err);
        res.render("user/serverError"); 
    }
}

const addProductPost= (req,res)=>{
    try{
        const product=new productModel({
            name:req.body.name,
            category:req.body.category,
            description:req.body.description,
            price:req.body.price,
            stock:req.body.stock,
            image:req.file.filename
        })
        product.save()
        res.redirect('/admin/products')
    }catch(error){
        console.log(error);
        res.render("user/serverError"); 
    }
}

module.exports={product,addProduct,addProductPost}