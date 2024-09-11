const userTable = require("../models/user.model");
const nodemailer = require('nodemailer');
const ResetPassword = require('../models/resetPwd'); // Assuming you have this model set up
const bcrypt = require('bcryptjs')



//node mailer for user validation of otp
const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use any email service,
    auth: {
        user: process.env.EMAIL_USER, //using the environment variable
        pass: process.env.EMAIL_PASS
    }
});

//initializing otp length we need
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000); // Generate 4-digit OTP
};

const forgetPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await userTable.findOne({ email });

        if (!user) {
            return res.status(400).render('validateEmail', { msg: {email: "There's no account for the provided email"} });
        }

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes

        // Save OTP to the database
        const resetPwdEntry = new ResetPassword({
            user_id: user._id,
            otp: otp,
            // expiresAt: expiresAt
        });

        await resetPwdEntry.save();

        // Send OTP via email
        const emailDetails = {
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for passwordManager reset is: ${otp}. It will expire in 10 minutes.`,
        };

        await sendOTP(emailDetails);

        res.status(200).render('forgetPwd', { msg: "OTP has been sent to your email." ,id:user._id});

    } catch (error) {
        console.error(error);
        res.status(500).render('500', { msg: "An error occurred while processing your request." });
    }
};


const sendOTP = async ({ to, subject, text }) => {
    const mailOptions = {
        from: `Pwd Manager <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        text: text
    };

    return transporter.sendMail(mailOptions);
};


//validatiing user's otp request

// const validateOTP = async (req, res) => {
//     // console.log(req.body);

//     const { otp, password, id} = req.body;
//     // console.log(`received OTP ${otp}, Id: ${id}`);
  
//     try {
//         const resetEntry = await ResetPassword.findOne({ user_id:id });

//         // const id = req.session.user_id = resetEntry._id

//         if (!resetEntry) {
//             return res.status(404).render('forgetPwd', { msg: "No user Found" });
//         }

//         if (resetEntry.otp!==otp) {
//             return res.status(404).render('forgetPwd', { msg: "Incorrect OTP" });
//         }

//         if (resetEntry.expiresAt < new Date()) {
//             return res.status(400).render('forgetPwd', { msg: "OTP has expired!" });
//         }

//         // OTP is valid, proceed with password reset
//         const user = await userTable.findById(resetEntry.user_id);
//         user.password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password.password)?await bcrypt.hashSync(password.password, 10):null

//         // password; // Here, ensure you hash the password

//         await user.save();

//         // Clean up the reset entry
//         await ResetPassword.deleteOne({ otp });

//         res.status(200).render('login', { msg:{succ: "Password reset successful!"} });

//     } catch (error) {
//         console.error(error);
//         res.status(500).render('500', { msg: "An error occurred while validating the OTP." });
//     }
// };


const validateOTP = async (req, res) => {
    const { otp, password } = req.body;

    try {
        const resetEntry = await ResetPassword.findOne({ otp });

        if (!resetEntry) {
            return res.status(400).render('forgetPwd', { msg: "Invalid OTP!" });
        }

        if (resetEntry.expiresAt < new Date()) {
            return res.status(400).render('forgetPwd', { msg: "OTP has expired!" });
        }

        // Find the user associated with the OTP
        const user = await userTable.findById(resetEntry.user_id);

        if (!user) {
            return res.status(404).render('forgetPwd', { msg: "User not found!" });
        }

        // Hash the new password before saving
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            return res.status(400).render('forgetPwd', { msg: "Password does not meet the required criteria!" });
        }

        const hashedPassword = await bcrypt.hashSync(password, 10);
        user.password = hashedPassword;

        await user.save();

        // Clean up the reset entry after successful password reset
        await ResetPassword.deleteOne({ otp });

        res.status(200).render('login', { msg: "Password reset successful!" });

    } catch (error) {
        console.error("Error during OTP validation:", error);
        res.status(500).render('500', { msg: "An error occurred while validating the OTP." });
    }
};


module.exports = { 
    forgetPassword, 
    validateOTP 
};
