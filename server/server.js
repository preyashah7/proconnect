const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const postRoutes = require("./routes/post");
app.use("/api/posts", postRoutes);

const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);
 
// Connect DB and Start Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log("🚀 Server running on port", process.env.PORT || 5000);
    });
  })
  .catch((err) => console.error("❌ DB Connection Error:", err));
