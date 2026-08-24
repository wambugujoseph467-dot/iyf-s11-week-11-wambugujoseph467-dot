// src/controllers/commentsController.js
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Get comments for a post
const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .sort({ createdAt: -1 });
        
        res.json(comments);
    } catch (error) {
        next(error);
    }
};

// Add comment to post
const createComment = async (req, res, next) => {
    try {
        const { content, author } = req.body;
        const postId = req.params.postId;
        
        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        const comment = new Comment({
            content,
            author,
            post: postId
        });
        
        await comment.save();
        
        res.status(201).json(comment);
    } catch (error) {
        next(error);
    }
};

// Delete comment
const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.commentId);
        
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = { getComments, createComment, deleteComment };