
const userReg = require("../models/user.model");
const bcrypt = require("bcryptjs")



const regUser = async (req,res) => {
    
    try {
        const data=req.body

        //check if user already exit

        const existUser = await userReg.findOne({email: data.email});
        const hashPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(data.password)?await bcrypt.hashSync(data.password, 10):null
        
        data.password=hashPwd;

        if(existUser){
            res.render('registration',{msg: "user already exist"})
        }else{
            const userData = await userReg.create(data)
            console.log(userData);
            res.redirect('login')
            
        }
        
    } catch (error) {

        console.log(error.message);
        res.status(500).render('registration', { msg: error.message.split(":")[2].split(",")[0] });
    }

}

const loginUser = async (req, res) => {
    try {

        const {email, password} = req.body;

        // Find user by email
        const User = await userReg.findOne({email});
        
        // Check if user exists
        if (!User) {
            return res.status(500).render('login', { msg: { email: "User email not found" } });
        }

        const isMatch = await bcrypt.compare(password, User.password)

        if(!isMatch){
            return res.status(500).render('login',{ msg: { password: "Incorrect password" }})
        }
        // if (User.password !== password) {
        //     return res.status(400).render('login',{ msg: { password: "Incorrect password" }})
        // }

         // Store user ID in session
         req.session.userId = User._id;
         req.session.userEmail = User.email;


        // If successful, redirect to the home page or dashboard
        res.redirect('/');

    } catch (error) {
        console.error(error.message);
        res.status(500).render('login', { msg: "user details not found"});
    }
};

const logoutUser = (req, res) => {
    req.session.destroy();
    res.redirect('login'); 
};

module.exports = {
    regUser,
    loginUser,
    logoutUser
}