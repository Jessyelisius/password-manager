
const userPassword = require('../models/userPwd.model');
const userTable = require('../models/user.model'); // stored user's id here
const { encryptPassword } = require('../utils/cryptHash');


const createPassword = async (req, res) => {
    try {
        const { name, purpose, password } = req.body;

        // Validate inputs
        if (!name) return res.status(400).render('createPassword/createPwd', { msg: { name: "Please enter a name" } });
        if (!purpose) return res.status(400).render('createPassword/createPwd', { msg: { purpose: "Please enter a purpose for password" } });
        if (!password) return res.status(400).render('createPassword/createPwd', { msg: { password: "Please enter a password" } });
        if (password.length>30) return res.status(400).render('createPassword/createPwd', { msg: { password: "Please is too long" } });

        // Check if the user is registered
        const sessionID = req.session.userId;

        if (!sessionID) {
            return res.status(400).render('createPassword/createPwd', { msg: { error: "User is not registered" } });
        }
            
        // Hash the password
        const hashedPassword = password?.length<30?encryptPassword(password):null;

        // Create the user password entry
        const newUserPassword = new userPassword({
            user_id: sessionID,
            name: name,
            purpose: purpose,
            password: hashedPassword.encryptedData,
            iv:hashedPassword.iv,
            key:hashedPassword.key
        });

        await newUserPassword.save();

        res.redirect('/'); // Redirect to home page
    } catch (error) {
        console.error(error);
        res.status(500).render('500', { msg: "Internal Server Error" });
    }
}

const deletePassword = async (req,res) =>{

    try {
        const idPassword = req.params.idPwd;

        //check if password is stored in the db
        if(!idPassword) return res.status(401).render('500', {msg: "Invalid operation, password not found"});

        //proceed to delete the password
       await userPassword.deleteOne({_id: idPassword});
        res.redirect('/');
    } catch (error) {
        res.status(500).render('500', {msg:"password not found"})

    }

}

const editPassword = async (req, res) => {
    try {
        const editID = req.params.id;

        // Find the document by ID
        const userPwd = await userPassword.findById(editID);
        if (!userPwd) return res.status(404).render('500', { msg: "Password details not found" });

        // Validate the input
        const { name, purpose, password } = req.body;
        if (!name) return res.status(400).render('createPassword/editPwd', { msg: { name: "Please enter a name" } });
        if (!purpose) return res.status(400).render('createPassword/editPwd', { msg: { purpose: "Please enter a purpose for password" } });
        if (!password) return res.status(400).render('createPassword/editPwd', { msg: { password: "Please enter a password" } });

        // Hash the password
        const hashedPassword = password?.length<30?encryptPassword(password):null;

        // Update the document
        userPwd.name = name;
        userPwd.purpose = purpose;
        userPwd.password = hashedPassword.encryptedData;
        userPwd.iv = hashedPassword.iv;
        userPwd.key = hashedPassword.key

        await userPwd.save();

        // Redirect after successful update
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).render('500', { msg: "Internal Server Error" });
    }
};


module.exports = { 
    createPassword,
    deletePassword,
    editPassword
};
