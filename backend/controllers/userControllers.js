const HttpError = require('../models/errorModel')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
require('dotenv').config()
const cloudinary = require('cloudinary').v2
const nodemailer=require('nodemailer')

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, password2 } = req.body;

        // Check if required fields are provided
        if (!name || !email || !password || !password2) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        // Convert email to lowercase and check if it already exists
        const newEmail = email.toLowerCase();
        const emailExists = await User.findOne({ email: newEmail });

        if (emailExists) {
            return next(new HttpError("Email already exists.", 422));
        }



        // Check if password meets the minimum length requirement
        if ((password.trim()).length < 6) {
            return next(new HttpError("Password should contain at least 6 characters.", 422));
        }

        // Check if passwords match
        if (password !== password2) {
            return next(new HttpError("Passwords do not match.", 422));
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = await User.create({ name, email: newEmail, password: hashedPass });

        res.status(201).json(`new user ${newEmail} registered`);

    } catch (error) {
        return next(new HttpError("User registration failed.", 422));
    }
}

const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return next(new HttpError("Fill in all fields.",422))
        }

        const newEmail = email.toLowerCase()
        const user = await User.findOne({ email: newEmail })

        if (!user) {
            return next(new HttpError("Invalid credentials.",422))
        }
        if (!user.verified) {
            return next(new HttpError("Please Verify Your Mail.",422))
        }

        const comparePass = await bcrypt.compare(password,user.password)
        if (!comparePass) {
            return next(new HttpError("Invalid credentials.",422))
        }
        
        const { _id: id, name } = user
        const token = jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: '1d' })

        const expiresIn = 4 * 60 * 60
        const expiryDate = new Date(Date.now() + expiresIn * 1000)

        res.status(200).json({token,id,name,expiryDate})
    }
    catch (error) {
        return next(new HttpError("User registration failed.",422))
    }
}

const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password')
        if (!user) {
            return next(new HttpError(error))
        }
        res.status(200).json(user)
    }
    catch (error) {
        return next(new HttpError(error))
    }
}

const changeAvatar = async (req, res, next) => {
    try {
    
        if (!req.files) {
            return next(new HttpError("please choose an image",422))
        }
        const user = await User.findById(req.user.id)

        if (user.avatar) {
            const publicId = (user.avatar).split('/').pop().split('.')[0];
            try {
                await cloudinary.uploader.destroy(`sanidhya/${publicId}`)
            }
            catch (error) {
                return next(new HttpError(error))
            }
        }
        const { avatar } = req.files
        if (avatar.size > 500000) {
            return next(new HttpError("Profile picture too big. Should be less than 500kb"),422)
        }

        const response = await cloudinary.uploader.upload(avatar.tempFilePath, { folder: 'sanidhya' }, async (err) => {
            if (err) {
                return next(new HttpError(err))
            }
        })
   
        const updatedAvatar = await User.findByIdAndUpdate(req.user.id, { avatar: response.secure_url }, { new: true })
        if (!updatedAvatar) {
            return next(new HttpError("Avatar could not be changed",422))
        }
        res.status(200).json(updatedAvatar)
        
        
    }
    catch (error) {
        return next(new HttpError(error))
    }
}

const editUser = async (req, res, next) => {
    try {
        const { name, email, currentPassword, newPassword, confirmNewPassword } = req.body
        if (!name || !email || !currentPassword || !newPassword) {
        return next(new HttpError('Fill in all details',422))
        }

        const user = await User.findById(req.user.id)
        if (!user) {
        return next(new HttpError("User not found",403))
        }
        const emailExist = await User.findOne({ email })
        if (emailExist && (emailExist._id != req.user.id)) {
            return next(new HttpError('Email already exist.',422))
        }
        const validateUserPassword = await bcrypt.compare(currentPassword, user.password)
        if (!validateUserPassword) {
            return next(new HttpError("Invalid current password",422))
        }
        if (newPassword !== confirmNewPassword) {
            return next(new HttpError('New Password do not match',422))
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPassword, salt)
        const newInfo = await User.findByIdAndUpdate(req.user.id, { name, email, password: hash }, { new: true })
        res.status(200).json(newInfo)

            
    }
    catch (error) {
        return next(new HttpError(error))
    }
}

const getAuthors = async (req, res, next) => {
    try {
        const authors = await User.find().select('-password')
        res.status(200).json(authors)
    }
    catch (error) {
        return next(new HttpError(error))
    }
}

const verifyMail = async (req, res, next) => {
    const { email } = req.body
    
    if (!email) {
        return next(new HttpError("Fill in all fields.", 422));
    }
    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });

    if (!user) {
        return next(new HttpError("User doesn't exist.", 422));
    }
    const { _id: id } = user
    const ptoken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '10m' })

    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })


        let info = await transporter.sendMail({
            from: `${process.env.MAIL_USER}`,
            to: `${email}`,
            subject: `Verify Mail`,
            html: `<h1>Verify your mail</h1>
            <p>Click on the following link to verify your mail:</p>
            <a href="http://localhost:3000/verified/${ptoken}">http://localhost:3000/verified/${ptoken}</a>
            <p>The link will expire in 10 minutes.</p>`,
        })
        res.status(200).json("Mail sent")

    }
    catch (error) {
        return next(new HttpError("Link Cannot be sent.", 500));
    }
};

const verifiedMail = async (req, res, next) => {
    try {

        const ptoken = req.params.token

        const decodedToken = jwt.verify(
            ptoken,
            process.env.JWT_SECRET
        );
        
        if (!decodedToken) {
            return next(new HttpError('Unauthorized. Invalid token',403))
        }

        const id = decodedToken.id

        const newInfo = await User.findByIdAndUpdate(id, { verified: 1 }, { new: true })
        res.status(200).json(newInfo)

    } catch (error) {
        return next(new HttpError("Cann't verify the Mail.", 500));
    }
};

const ForgotPassword = async (req, res, next)=>{
    const { email } = req.body
    
    if (!email) {
        return next(new HttpError("Fill in all fields.", 422));
    }
    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });

    if (!user) {
        return next(new HttpError("User doesn't exist.", 422));
    }
    const { _id: id} = user
    const ptoken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '10m' })

    try{
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            port: 587,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })


        let info = await transporter.sendMail({ 
            from: `${process.env.MAIL_USER}`,
            to:`${email}`,
            subject: `Reset Password`,
            html: `<h1>Reset Your Password</h1>
            <p>Click on the following link to reset your password:</p>
            <a href="http://localhost:3000/reset-password/${ptoken}">http://localhost:3000/reset-password/${ptoken}</a>
            <p>The link will expire in 10 minutes.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>`,
        })
        res.status(200).json("Mail sent")

    }
    catch (error) {
        return next(new HttpError("Link Cannot be sent.", 500));
    }
}

const ResetPassword = async (req, res, next) => {
    try {

        const ptoken = req.params.token
        const { password, password2 } = req.body;

        const decodedToken = jwt.verify(
            ptoken,
            process.env.JWT_SECRET
        );
        
        if (!decodedToken) {
            return next(new HttpError('Unauthorized. Invalid token',403))
          }

        if (!password || !password2) {
            return next(new HttpError("Fill in all fields.", 422));
        }


        if ((password.trim()).length < 6) {
            return next(new HttpError("Password should contain at least 6 characters.", 422));
        }

        if (password !== password2) {
            return next(new HttpError("Passwords do not match.", 422));
        }

        const id = decodedToken.id

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const newInfo = await User.findByIdAndUpdate(id, { password: hashedPass }, { new: true })
        res.status(200).json(newInfo)

    } catch (error) {
        return next(new HttpError("User Password can't be updated.", 500));
    }
};

module.exports = { registerUser, loginUser, getUser, editUser, getAuthors, changeAvatar, ResetPassword ,ForgotPassword,verifyMail,verifiedMail}
    