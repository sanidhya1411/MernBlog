const Post = require('../models/postModel')
const User = require('../models/userModel')
const HttpError = require('../models/errorModel')
const fs = require('fs')
const path=require('path')
const { v4: uuid } = require('uuid')
const cloudinary=require('cloudinary').v2

const createPost = async (req, res, next) => {
    try { 
        let { title, category, description } = req.body
        if (!title || !category || !description || !req.files) {
            return next(new HttpError("Fill in all fields and choose thumbnail."))
        }
        const { thumbnail } = req.files
        if (thumbnail.size > 2000000) {
            return next(new HttpError("Thumbnail too big. File should be less than 2mb."))
        }

        const response = await cloudinary.uploader.upload(thumbnail.tempFilePath, { folder: 'sanidhya' }, async (err) => {
            if (err) {
                return next(new HttpError(err))
            }
        })
        if (response) {
            const newPost = await Post.create({title,category,description,thumbnail:response.secure_url,creator:req.user.id})
            if (!newPost) {
                return next(new HttpError("Post couldn't be created.",422))
            }
            const currentUser = await User.findById(req.user.id)
            const userPostCount = currentUser.posts + 1;
            await User.findByIdAndUpdate(req.user.id,{posts:userPostCount})
            res.status(201).json(newPost)
        }
        else {
            return next(new HttpError("Post couldn't be created.",422))
        }

    }
    catch (error) {
        return next(new HttpError(error))
    }
}
const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ updatedAt: -1 })
        res.status(200).json(posts)
    }
    catch (error) {
        return next(new HttpError(error))
    }
}

const getPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId)
        if (!post) {
            return next(new HttpError("post not found",404))
        }
        res.status(200).json(post)
    }
    catch (error) {
        return next(new HttpError(error))
    }
}
const getCatPosts = async (req, res, next) => {
    try {
        const { category } =req.params
        const catPosts= await Post.find({category}).sort({ createdAt: -1 })
        res.status(200).json(catPosts)
    }
    catch (error) {
        return next(new HttpError(error))
    }
}
const getUserPosts = async (req, res, next) => {
    try {
        const { id } = req.params
        const posts=await Post.find({creator:id}).sort({createdAt:-1})
        res.status(200).json(posts)
    }
    catch (error) {
        return next(new HttpError(error))
    }
}
const editPost = async (req, res, next) => {
    try {
      
        let updatedPost
        const postId = req.params.id

        let { title, category, description } = req.body
        if (!title || !category || description.lenght < 12) {
            return next(new HttpError("Fill in all fields.",422))
        }
        const oldPost = await Post.findById(postId)
        if (req.user.id == oldPost.creator) {
            if (!req.files) {
                updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true })
            }
            else {

                const publicId = (oldPost.thumbnail).split('/').pop().split('.')[0];
                try {
                    await cloudinary.uploader.destroy(`sanidhya/${publicId}`)
                }
                catch (error) {
                    return next(new HttpError(error))
                }
               
                const { thumbnail } = req.files;
                if (thumbnail.size > 3000000) {
                    return next(new HttpError("Thumbnail too big. should be less than 3mb."))
                }
                const response = await cloudinary.uploader.upload(thumbnail.tempFilePath, { folder: 'sanidhya' }, async (err) => {
                    if (err) {
                        return next(new HttpError(err))
                    }
                })
             
                updatedPost=await Post.findByIdAndUpdate(postId,{title,category,description,thumbnail:response.secure_url},{new:true})
            }
            if (!updatedPost) {
                return next(new HttpError("Couldn't update post.",400))
            }
    
            res.status(200).json(updatedPost)
        }
        else {
            return next(new HttpError("Couldn't update post.",403))
        }

    }
    catch (error) {
        return next(new HttpError(error))
    }
}
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id
        if (!postId) {
            return next(new HttpError("Post unavailable",400))
        }
        const post = await Post.findById(postId)
        if (req.user.id == post.creator) {

            const publicId = (post.thumbnail).split('/').pop().split('.')[0];
            try {
                await cloudinary.uploader.destroy(`sanidhya/${publicId}`)
            }
            catch (error) {
                return next(new HttpError(error))
            }
            
            await Post.findByIdAndDelete(postId)
            const currentUser = await User.findById(req.user.id);
            const userPostCount = currentUser?.posts - 1;
            await User.findByIdAndUpdate(req.user.id, { posts: userPostCount })
            res.json(`Post ${postId} deleted`)
        }
        else {
            return next(new HttpError("Post couldn't be deleted",403))
        }
    }
    catch (error) {
        return next(new HttpError(error))
    }
}

module.exports={createPost,getPosts,getPost,getCatPosts,getUserPosts,editPost,deletePost}