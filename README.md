# 🌐 ProConnect – A Mini LinkedIn-Style Community Platform

A modern, responsive, and feature-rich LinkedIn-style platform where users can register, create posts, like content, and explore professional profiles.

---

## 🚀 Live Demo

👉 [Visit ProConnect Live](https://proconnect-wheat.vercel.app/)

---

## 📂 GitHub Repository

📎 [GitHub Source Code](https://github.com/preyashah7/proconnect)

---

## 🛠️ Tech Stack

**Frontend**:  
⚛️ React.js with Material UI  

**Backend**:  
🚀 Node.js with Express.js  

**Database**:  
🗂 MongoDB using Mongoose ODM  

**Deployment**:  
🌐 Vercel (Frontend)  
🛠 Render (Backend)

---

## ⚙️ Setup Instructions

### 📦 Backend Setup (Optional for local development)

1. **Clone the repository**  
   git clone https://github.com/preyashah7/proconnect.git

2. **Navigate to the backend folder**

   ```bash
   cd server
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Add environment variables**
   Create a `.env` file in the `server/` folder with the following:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

5. **Run backend server locally**

   ```bash
   node server.js
   ```

---

### 💻 Frontend Setup

1. **Navigate to client folder**

   ```bash
   cd client
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Update backend API URL**
   In `src/api/posts.js` and other API files, set:

   ```js
   baseURL: "https://proconnect-backend.onrender.com/api"
   ```

4. **Run the frontend**

   ```bash
   npm start
   ```

---

## 👤 Demo User Login

Use the following credentials to explore the app:

```
Email: foram@gmail.com  
Password: 123456
```

---

## ✨ Features

✅ User Registration & Login
✅ User Profiles with Bio
✅ Public Post Feed (Text-only posts)
✅ Like/Unlike Posts
✅ Responsive Design
✅ LinkedIn-inspired Clean UI

---

## 📌 Notes

* The app uses token-based authentication with JWT.
* Comments and follow system can be easily integrated in future versions.

---

> 💼 Built with care by [Preya Shah](https://github.com/preyashah7)

