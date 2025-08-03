# ProConnect – A Mini LinkedIn Clone

## 🚀 Live Demo
🔗 [https://proconnect-wheat.vercel.app/](https://proconnect-wheat.vercel.app/)

## 📂 GitHub Repository
📁 [https://github.com/preyashah7/proconnect](https://github.com/preyashah7/proconnect)

---

## 🛠 Stack Used

- **Frontend**: React (with Material UI)
- **Backend**: Node.js (Express.js)
- **Database**: MongoDB (with Mongoose)
- **Deployment**: Vercel (Frontend), Render (Backend)

---

## ⚙️ Setup Instructions

### 🔧 Backend (Render Hosted or Run Locally)

1. Clone the repository:
   ```bash
   git clone https://github.com/preyashah7/proconnect.git
   ````

2. Navigate to backend folder:

   ```bash
   cd server
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

5. Run the backend:

   ```bash
   node server.js
   ```

---

### 🎨 Frontend

1. Navigate to the frontend folder:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Update `src/api/posts.js` or other API configs with:

   ```js
   baseURL: "https://your-backend-name.onrender.com/api"
   ```

4. Run the frontend:

   ```bash
   npm start
   ```

---

## 👤 Demo User Login

Use the following credentials to try out the platform:

```
Email: foram@gmail.com  
Password: 123456
```

---

## 🧭 How to Use

When you visit the live site, you’ll be taken to the **Login Page**.

* 🔐 **New to the platform?** Click on **“Register”** at the bottom to create an account.
* ✅ Once logged in, you'll land on the **Home Feed**, where you can:

  * View posts from other users
  * Like/unlike posts
  * View **timestamps** like `2m`, `1h`, `3d` ago
  * Click on any user’s **name or avatar** to visit their **profile page**

### 🧑‍💼 Profile Page

* Displays the selected user's **bio** and **all their posts**

### 🛠 Dashboard (Navbar > Dashboard)

Here you can:

* ✏️ **Update your profile** (name, email, bio)
* 📝 **Create new posts**
* 📂 View all **your own posts**

---

## ✨ Features

* ✅ User Authentication (Register/Login with JWT)
* ✅ Public Post Feed (text-only)
* ✅ Like/Unlike posts
* ✅ Profile pages with all user posts
* ✅ Dashboard to manage your posts & profile
* ✅ Timestamps (e.g., 5m ago, 3h ago)
* ✅ Responsive, LinkedIn-style UI

---

## 📩 Submission Details

* 🔗 **GitHub**: [https://github.com/preyashah7/proconnect](https://github.com/preyashah7/proconnect)
* 🌐 **Live**: [https://proconnect-wheat.vercel.app/](https://proconnect-wheat.vercel.app/)

---
💼 Built with care by Preya Shah
