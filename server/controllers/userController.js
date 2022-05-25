require("../models/Category")




/**
 * get /login
 * login
 */
exports.login = async (req, res) => {
    try {
        res.render("login")
    } catch (err){
        res.status(500).send({message : err.message || "Error occured"})
    }
}







