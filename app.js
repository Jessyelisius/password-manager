//initialize express
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session')
require('dotenv').config();


const app = express()

let port = process.env.PORT || 3000

// const authMiddleware = require('./middleware/authMiddleware');
//db connection
const { default: mongoose } = require('mongoose');
const authMiddleware = require('./middleware/authMiddleware');
const userPassword = require('./models/userPwd.model');
const { decryptPassword } = require('./utils/cryptHash');

const dbconnect = "mongodb://localhost:27017/pwdManager";
mongoose.set("strictQuery",true);
mongoose.set("runValidators", true)
mongoose.connect(dbconnect)
.then((result) => {
    console.log("dbConnected");
    app.listen(port,()=>console.log("http://localhost:3000"))
})
.catch((err) => {
    console.log(err);
})


//view engine
app.set('view engine', 'ejs');

//public register
app.use(express.static('public'))

//initialise json
app.use(express.json());
app.use(session({secret: "dgfcnbgbybjuybkyvrctr", resave: false, saveUninitialized: true}));

//post request managers
app.use(express.urlencoded({extended: true}));

//router connection
app.use('/auth',require('./route/auth'))//auth routes
app.use('/',require('./route/home'))// auth routes for password creation

// Apply the middleware to the home route
app.use('/', authMiddleware, async (req, res) => {
    try {
        // Fetch passwords associated with the authenticated user
        const userPwd = await userPassword.find({ user_id: req.session.userId });

        let displayPwd = userPwd?.map(i => {

            // Decrypt the password using the stored IV and encrypted password
            let unhashed = decryptPassword(i.password,i.key, i.iv,);
            i.password = unhashed;

            return i;
        });

        // Render the home page with the decrypted passwords
        res.render('createPassword/home', { newUserPassword: displayPwd });
    } catch (error) {
        console.error('Error during decryption:', error);
        res.status(500).send('An error occurred while decrypting the passwords.');
    }
});

