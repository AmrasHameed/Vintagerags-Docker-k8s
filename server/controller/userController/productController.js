const catModel = require('../../model/categModel')
const productModel = require('../../model/productModel')
const mongoose = require('mongoose')
const flash = require('express-flash')






const shop = async (req, res) => {
    try {
        let products;
        const perPage=3;
        const categoryId = req.query.category;
        const sortBy = req.query.sortBy;
        const page=parseInt(req.query.page)||1;
        if (sortBy) {
            if (req.session.filterCat) {
                products = await getProductsWithSorting({ category:new mongoose.Types.ObjectId(req.session.filterCat), status: true }, sortBy);
            } else {
                products = await getProductsWithSorting({ status: true }, sortBy);
            }
        } else {
            if (categoryId) {
                products = await productModel.find({ category: categoryId, status: true }).exec();
                req.session.filterCat = categoryId;
            } else {
                products = await productModel.find({ status: true }).exec();
            }
        }
        const totalPages = Math.ceil(products.length / perPage);
        const startIndex = (page - 1) * perPage;
        const endIndex = page * perPage;
        const productsPaginated = products.slice(startIndex, endIndex);
        
        
        const categoryCounts = await getCategoryCounts();
        const categories = await catModel.find();

        res.render('user/shop', { products:productsPaginated, categories, categoryCounts ,currentPage:page,totalPages,sortBy,categoryId});
    } catch (error) {
        console.log(error);
        res.render('user/serverError');
    }
}

const getProductsWithSorting = async (filter, sortBy) => {
    const aggregationPipeline = [
        { $match: filter }
    ];

    if (sortBy === 'nameAZ') {
        aggregationPipeline.push(
            { $addFields: { name_lower: { $toLower: "$name" } } },
            { $sort: { name_lower: 1 } }
        );
    }
    if (sortBy === 'nameZA') {
        aggregationPipeline.push(
            { $addFields: { name_lower: { $toLower: "$name" } } },
            { $sort: { name_lower: -1 } }
        );
    }
    if (sortBy === 'priceHigh') {
        aggregationPipeline.push(
            { $sort: { price: 1 } }
        );
    }
    if (sortBy === 'priceLow') {
        aggregationPipeline.push(
            { $sort: { price: -1 } }
        );
    }
    if(sortBy=='newArrivals'){
        aggregationPipeline.push(
            {$sort:{_id:-1}},
            {$limit:6}
        )
    }


    return productModel.aggregate(aggregationPipeline).exec();
}

const getCategoryCounts = async () => {
    const aggregationPipeline = [
        { $match: { status: true } },
        { $group: { _id: "$category", count: { $sum: 1 } } }
    ];

    const categoryCounts = await productModel.aggregate(aggregationPipeline);
    const categoryCountsMap = {};

    categoryCounts.forEach(count => {
        categoryCountsMap[count._id] = count.count;
    });

    return categoryCountsMap;
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

module.exports = { shop, shopSingle}