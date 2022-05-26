const express = require("express")
const router = express.Router();
const userController = require("../controllers/userController");





//? signUp page
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.createNewUser)


//? login page
router.get('/login', userController.loginPage)
router.post('/login', userController.userLogin)


//? logout 
router.get('/logout', userController.logout)

module.exports = router


