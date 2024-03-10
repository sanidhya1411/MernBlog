const HttpError = require('../models/errorModel')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { v4: uuid } = require('uuid')
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

        const comparePass = await bcrypt.compare(password,user.password)
        if (!comparePass) {
            return next(new HttpError("Invalid credentials.",422))
        }
        
        const { _id: id, name } = user
        const token = jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.status(200).json({token,id,name})
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

const forgotPassword = async (req, res, next) => {
    try {
        const {email, password, password2 } = req.body;

        if (!email) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        const newEmail = email.toLowerCase();
        const user = await User.findOne({ email: newEmail });

        if (!user) {
            return next(new HttpError("Email doesn't exist.", 422));
        }

        if ((password.trim()).length < 6) {
            return next(new HttpError("Password should contain at least 6 characters.", 422));
        }

        if (password !== password2) {
            return next(new HttpError("Passwords do not match.", 422));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const newInfo = await User.findByIdAndUpdate(user.id, { password: hashedPass }, { new: true })
        res.status(200).json(newInfo)

    } catch (error) {
        console.error(error);
        return next(new HttpError("User Password can't be updated.", 500));
    }
};

module.exports = { registerUser, loginUser, getUser, editUser, getAuthors, changeAvatar, forgotPassword }
    