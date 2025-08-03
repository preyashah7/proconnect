import axios from "axios";

const API = axios.create({
  baseURL: "https://proconnect-6254.onrender.com/api",
  withCredentials: true,
});

// Create new post
export const createPost = async (content) => {
  const res = await API.post("/posts", { content });
  return res.data;
};

// Get all posts
export const getAllPosts = async () => {
  const res = await API.get("/posts");
  return res.data;
};
