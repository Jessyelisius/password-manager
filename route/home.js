const express = require('express');
const create = require('../controllers/passwordCreate');
const authMiddleware = require('../middleware/authMiddleware');
const userPassword = require('../models/userPwd.model');
const { decryptPassword } = require('../utils/cryptHash');

const router = express.Router()

router.get('/createPwd',authMiddleware, (req, res) =>{
    res.render('createPassword/createPwd',{msg: ""})
})
router.post('/createPwd',authMiddleware, create.createPassword);

router.get('/editPwd/:id', authMiddleware, async (req,res) =>{

    const userPwd = await userPassword.findById(req.params.id);

    if(!userPwd)return res.status(404).render('500', {msg: "details not found"});

    // Validate that userPwd has the necessary properties
    if (userPwd.password && userPwd.iv) {
        // Decrypt the password before rendering
        const decryptedPassword = decryptPassword(userPwd.password, userPwd.key, userPwd.iv);
        userPwd.password = decryptedPassword;

    } else {
        console.error("Password or IV is missing.");
        return res.status(400).render('500', { msg: "Decryption error: Password or IV missing." });
    }

    res.render('createPassword/editPwd',{msg: "", userPwd});

});

router.post('/editPwd/:id', authMiddleware, create.editPassword);

router.get('/deletePassword/:idPwd', create.deletePassword);
// router.get('createPwd', authMiddleware,)


module.exports = router;