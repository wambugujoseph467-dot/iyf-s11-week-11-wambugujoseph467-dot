const express = require("express");
const router = express.Router();

const postsController = require("../controllers/postsController");
const commentsController = require("../controllers/commentsController");
const { protect } = require("../middleware/auth");

// Public post routes
router.get("/", postsController.getAllPosts);
router.get("/:id", postsController.getPostById);

// Protected post routes
router.post("/", protect, postsController.createPost);
router.put("/:id", protect, postsController.updatePost);
router.delete("/:id", protect, postsController.deletePost);

router.post("/:id/like", protect, postsController.likePost);

// Comment routes
router.get("/:postId/comments", commentsController.getComments);
router.post(
  "/:postId/comments",
  protect,
  commentsController.createComment
);
router.delete(
  "/:postId/comments/:commentId",
  protect,
  commentsController.deleteComment
);

module.exports = router;