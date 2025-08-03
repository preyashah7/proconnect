const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");

// GET /api/users/me - Get current user's info
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email bio");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/users/me - Update name, email, or bio
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { name, email, bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, bio },
      { new: true, runValidators: true, select: "name email bio" }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/users/:id - Get public profile of a user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name bio email");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;