const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");

// Create a new post
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const newPost = new Post({
      content,
      user: req.user.id,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all posts with user name
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name bio")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get posts of specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 👇 Add this route to get current user's posts
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// routes/posts.js
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    post.content = req.body.content;
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    console.error("Edit error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Toggle like/unlike a post
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.user.id;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ liked: !alreadyLiked, likesCount: post.likes.length });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add a comment to a post
router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Comment text is required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const newComment = {
      user: req.user.id,
      text,
    };

    post.comments.push(newComment);
    await post.save();

    // Populate the user field in the latest comment for frontend use
    await post.populate("comments.user", "name");

    res.status(200).json(post.comments);
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
