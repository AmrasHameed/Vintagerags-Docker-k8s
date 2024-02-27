const adminModel = require('../../model/userModel')
const bcrypt = require('bcrypt')
const flash = require('express-flash')

const login = (req, res) => {
    try {
        if (req.session.isAdAuth) {
            return res.redirect('/admin/adminPanel')
        }
        res.render('admin/adLogin', { passwordError: req.query.passwordError })
    } catch (error) {
        console.log(error);
        res.render("user/serverError");
    }
}

const loginPost = async (req, res) => {
    try {
        const password = req.body.password
        const user = await adminModel.findOne({ email: req.body.email });
        if (user.isAdmin == true && await bcrypt.compare(password, user.password)) {
            req.session.isAdAuth = true;
            res.redirect('/admin/adminPanel');
        } else {
            res.redirect("/admin?passwordError=Invalid%20password%2Fusername");
        }
    } catch (error) {
        console.log(error);
        res.render("user/serverError");
    }
}

const adminPanel = (req, res) => {
    try {
        res.render('admin/adminPanel')
    } catch (err) {
        console.log(err);
        res.render("user/serverError");
    }
}

const adLogout = (req, res) => {
    try {
        req.session.isAdAuth = false;
        res.redirect('/admin')
    } catch (err) {
        console.log(err);
        res.render("user/serverError");
    }
}

const user = async (req, res) => {
    try {
        const user = await adminModel.find({})
        res.render('admin/users', { users: user })
    } catch (err) {
        console.log(err);
        res.render("user/serverError");
    }
}

const unblock = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await adminModel.findById(id);
        user.blocked = !user.blocked;
        await user.save();
        res.redirect('/admin/users')
    } catch (err) {
        console.log(err);
        res.render("user/serverError");
    }
}

module.exports = { login, loginPost, adminPanel, adLogout, user, unblock }