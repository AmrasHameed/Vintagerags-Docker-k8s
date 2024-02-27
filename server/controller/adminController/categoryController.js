const adminModel = require('../../model/userModel');
const CatModel = require('../../model/categModel');

const category = async (req, res) => {
    try {
        const updateSuccess = req.flash('updateSuccess');
        const catSuccess = req.flash('catSuccess');
        const categories = await CatModel.find({});
        res.render('admin/category', { category: categories, updateSuccess, catSuccess });
    } catch (err) {
        console.log(err);
        res.render("user/serverError");
    }
};

const addCategory = async (req, res) => {
    try {
        res.render('admin/addCategory');
    } catch (err) {
        console.log(err);
        res.render("user/serverError");
    }
};

const addCategoryPost = async (req, res) => {
    try {
        const catName = req.body.name;
        const catDescription = req.body.description;
        const catExist = await CatModel.findOne({ name: { $regex: new RegExp("^" + catName + "$", "i") } });
        console.log(catName);
        if (catExist) {
            console.log("Already Exist");
            req.flash('catError', 'Category Already Exists');
            return res.redirect('/admin/addCategory');
        } else {
            await CatModel.create({ name: catName, description: catDescription });
            req.flash('catSuccess', "Category Added Successfully")
            res.redirect('/admin/categories');
        }
    } catch (err) {
        console.log(err);
        res.render("user/serverError");
    }
};

const unlist = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await CatModel.findById(id);
        category.status = !category.status;
        await category.save();
        res.redirect('/admin/categories')
    } catch (err) {
        console.log(err);
        res.render("user/serverError");
    }
}

const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await CatModel.findById(id);
        res.render('admin/updateCategory', { category })
    } catch (err) {
        console.log(err);
        res.render("user/serverError");
    }
}

const updateCategoryPost = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await CatModel.findById(id);
        category.name = req.body.name
        category.description = req.body.description
        await category.save();
        req.flash('updateSuccess', "Category Updated Successfully")
        res.redirect('/admin/categories')
    } catch (err) {
        console.log(err);
        res.render("user/serverError");
    }
}

module.exports = { category, addCategory, addCategoryPost, unlist, updateCategory, updateCategoryPost };
