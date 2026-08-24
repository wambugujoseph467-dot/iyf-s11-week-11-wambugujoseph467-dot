const express = require("express");

const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
} = require("../controllers/postsController");

const router = express.Router();

// Get all posts
router.get("/", getAllPosts);

// Get one post
router.get("/:id", getPostById);

// Create a post
router.post("/", createPost);

// Update a post
router.put("/:id", updatePost);

// Delete a post
router.delete("/:id", deletePost);

// Like a post
router.post("/:id/like", likePost);

module.exports = router;