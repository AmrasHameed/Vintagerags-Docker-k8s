const catModel= require('../../model/categModel')
const productModel=require('../../model/productModel')
const mongoose = require('mongoose')
const flash = require('express-flash')






const shop = async (req, res) => {
    try {
        let products;
        const categoryId = req.query.category;
        const sortBy = req.query.sortBy;

        if (sortBy === 'nameAZ') {
            let matchStage = { status: true };
            if (categoryId) {
                matchStage.category = categoryId;
            }
            products = await productModel.aggregate([
                { $match: matchStage },
                { 
                    $addFields: { 
                        name_lower: { $toLower: "$name" } 
                    } 
                },
                { $sort: { name_lower: 1 } }
            ]).exec();
        } else {
            let filter = { status: true };
            if (categoryId) {
                filter.category = categoryId;
            }
            products = await productModel.find(filter).exec();
        }

        const categoryCounts = await productModel.aggregate([
            { $match: { status: true } },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);

        const categoryCountsMap = {};
        categoryCounts.forEach(count => {
            categoryCountsMap[count._id] = count.count;
        });

        const categories = await catModel.find();
        res.render('user/shop', { products, categories, categoryCounts: categoryCountsMap });
    } catch (error) {
        console.log(error);
        res.render('user/serverError');
    }
}




const shopSingle = async (req, res) => {
    try {
        const productId = req.params.id;
        const categories = await catModel.find();
        const productOne = await productModel.findById(productId); 
        const products = await productModel.find(); 
        res.render('user/shop-single', { productOne, products, categories });
    } catch (error) {
        console.log(error);
        res.render('user/serverError');
    }
}



module.exports={shop,shopSingle}