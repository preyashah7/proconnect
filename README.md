# ProConnect – A Mini LinkedIn Clone

## 🚀 Live Demo
[https://proconnect-wheat.vercel.app/](https://proconnect-wheat.vercel.app/)

## 📂 GitHub Repository
[https://github.com/preyashah7/proconnect](https://github.com/preyashah7/proconnect)

## 🛠 Stack Used
- **Frontend**: React (Material UI)
- **Backend**: Node.js (Express)
- **Database**: MongoDB (Mongoose)
- **Deployment**: Vercel (Frontend), Render (Backend)

## ⚙️ Setup Instructions

### Backend (Render Hosted or Local)
1. Clone the repository:
   ```bash
   git clone https://github.com/preyashah7/proconnect.git
````

2. Navigate to the backend folder:

   ```bash
   cd server
   ```
3. Install dependencies:

   ```bash
   npm install
   ```
4. Create a `.env` file with:

   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
5. Run the server locally:

   ```bash
   node server.js
   ```

### Frontend

1. Navigate to client folder:

   ```bash
   cd client
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Update `src/api/posts.js` and other API files with:

   ```js
   baseURL: "https://your-backend-url.onrender.com/api"
   ```
4. Run frontend:

   ```bash
   npm start
   ```

## 👤 Demo User

Use the following credentials to try out the platform:

```
Email: foram@gmail.com  
Password: 123456
```

## ✨ Extra Features (Optional)

* Like/Unlike posts
* Responsive design
* Modern LinkedIn-style UI




