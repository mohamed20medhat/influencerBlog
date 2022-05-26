require("../models/database");
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const router = require('express').Router();
const cookieParser = require('cookie-parser');
const bcrypt = require("bcryptjs/dist/bcrypt");

router.use(cookieParser())



/**
 * get /use/signup
 * view signup page
 */
exports.signUpPage = async (req, res) => {
    try {
        res.render("signUp")
    } catch (err) {
        res.status(500).send({ message: err.message || "Error occured" })
    }
}


/**
 * post /user/signup
 * create new user
 */
exports.createNewUser = async (req, res) => {
    const { name, password } = req.body
    console.log(req.body)
    //simple data validation
    if (!name || typeof name !== 'string') {
        res.render('signUp', { message: "Invalid name" })
    }
    if (password.length < 8) {
        return res.render('signUp', {
            message: "Password too small, password should be atleast 8 character"
        })
    }

    //incrypt password
    const encryptedPassword = await bcrypt.hash(password, 8);
    const createNewUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: encryptedPassword,
        isPrimum: typeof req.body.primum !== 'undefined' ? true : false
    })

    try {
        const newUser = await createNewUser.save()

        //! redirect to user account page
        // res.render('signUp', {
        //     message: "Congratulations. you successfully joined us"
        // })

        res.render("login", {
            message: "Congratulations. you successfully joined us"
        })

    } catch (error) {
        console.log(error)
        res.render('signUp', {
            message: "Login Faild. check internet connection"
        })
    }

}



/**
 * get /user/login
 * view login page
 */
exports.loginPage = async (req, res) => {
    try {
        res.render("login")
    } catch (err) {
        res.status(500).send({ message: err.message || "Error occured" })
    }
}

/**
 * post /user/login
 * user can access his account. log the user in
 */
exports.userLogin = async (req, res) => {
    const { email, password } = req.body
    let token
    let userInDb
    //admin access
    if (email === 'admin@admin' && password === 'adminadmin') {
        token = jwt.sign({ email: "admin@admin" }, "secrete")
    } else {
        //user access
        userInDb = await User.findOne({ email: email })
        if (!userInDb) {
            return res.render("user/login", { message: "User Not Found" })
        }

        if (await bcrypt.compare(password, userInDb.password)) {
            token = jwt.sign({ email: email }, "secret")
        } else {
            return res.render("user/login", { message: "Inncorrect password" })
        }
    }

    res.cookie('jwt', token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
    })

    res.cookie('userId', userInDb._id, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
    })

    res.redirect("/")
}


/**
 * get /user/logout
 * logout => clear the cookie
 */
exports.logout = async (req, res) => {
    if (req.cookies['jwt']) {
        res.clearCookie("jwt")
        res.clearCookie("userId")
    }

    res.redirect('/')

}






