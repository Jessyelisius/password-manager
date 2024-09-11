const pwdCOntroller = require('../controllers/userController')
const resetPass = require("../controllers/forgetpwdController");
const resetPassword = require('../models/resetPwd');


const router = require('express').Router();


//registration
router.get('/registration', (req,res) => {

    res.render('registration',{msg:"register pls"})
})

router.get('/login', (req,res) => {
    
    res.render('login', {msg:"Login Pls"})
   
})

router.get('/validateEmail', (req,res) => {
    res.render('validateEmail',{msg:""});
})


router.post('/registration',pwdCOntroller.regUser);
router.post('/login', pwdCOntroller.loginUser);
router.get('/logout', pwdCOntroller.logoutUser);
router.post('/validateEmail', resetPass.forgetPassword);



router.get('/forgetPwd', (req,res)=>{
    res.render('forgetPwd',{msg:""})
})

// router.post('/forgetPwd', resetPass.forgetPassword);
router.post('/validateOTP', resetPass.validateOTP);

module.exports = router;