// src/controllers/postsController.js
const Post = require('../models/Post');

// Get all posts
const getAllPosts = async (req, res, next) => {
    try {
        const { author, search, sort, page = 1, limit = 10 } = req.query;
        
        // Build query
        let query = {};
        
        if (author) {
            query.author = new RegExp(author, 'i');
        }
        
        if (search) {
            query.$text = { $search: search };
        }
        
        // Build sort
        let sortOption = { createdAt: -1 };  // Default: newest first
        
        if (sort === 'oldest') {
            sortOption = { createdAt: 1 };
        } else if (sort === 'popular') {
            sortOption = { likes: -1 };
        }
        
        // Pagination
        const skip = (page - 1) * limit;
        
        const posts = await Post.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Post.countDocuments(query);
        
        res.json({
            posts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
        
    } catch (error) {
        next(error);
    }
};

// Get single post
const getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        res.json(post);
    } catch (error) {
        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid post ID' });
        }
        next(error);
    }
};

// Create post
const createPost = async (req, res, next) => {
    try {
        const { title, content, author, tags } = req.body;
        
        const post = new Post({
            title,
            content,
            author,
            tags
        });
        
        await post.save();
        
        res.status(201).json(post);
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ errors: messages });
        }
        next(error);
    }
};

// Update post
const updatePost = async (req, res, next) => {
    try {
        const { title, content, tags } = req.body;
        
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { title, content, tags },
            { new: true, runValidators: true }
        );
        
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        res.json(post);
    } catch (error) {
        next(error);
    }
};

// Delete post
const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// Like post
const likePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        await post.like();  // Using instance method
        
        res.json(post);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    likePost
};