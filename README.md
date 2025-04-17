# 🎓 Student Housing Helper

The Student Housing Helper is a full-stack web application designed to connect students with compatible roommates and available housing in Ireland. It supports user registration, matching via a detailed quiz, real-time chat, Google Maps integration, listings, applications, groups, and more.

---

## 📦 Tech Stack

### Frontend
- React.js (Vite)
- React Router
- Stream Chat API
- i18next (Multilingual support: EN, ES, FR, DE)
- Google Maps JavaScript API
- CSS Modules

### Backend
- Node.js & Express
- MongoDB (via Mongoose)
- JWT for auth
- Multer (image uploads)

---

## ✨ Features

- 🔐 **Authentication** — Register, Login, Forgot/Reset Password
- 🧠 **Compatibility Quiz** — 12 lifestyle questions with weighted priorities
- 🔎 **Matchmaking** — Top 3 user matches via algorithm based on quiz responses
- 💬 **Messaging** — Real-time chat with individual & group messaging (Stream Chat)
- 🏠 **Listings** — Create/view/apply for property listings with Google Maps
- 👥 **Groups** — Create groups, invite others, apply as a group
- 📬 **Applications** — Landlords can approve or reject applications
- 🌍 **Multilingual** — English, Spanish, French, German
- 📍 **Maps** — Google Maps embedded in listing view

---

## 🛠 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/dylancallaghan/FYP_main.git
cd FYP_main
```

### 2. Client setup

```bash
cd client
npm install
npm start
```

### 3. Server setup

```bash
cd ../server
npm install
npx nodemon index.js
```

### 4. Environment Variables

**In `/client/.env`:**

```ini
VITE_STREAM_API_KEY=your_stream_key
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
```

**In `/server/.env`:**

```ini
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
STREAM_API_KEY=your_stream_key
STREAM_SECRET=your_stream_secret
```

---

## 🗂 Folder Structure

```
FYP_main/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── i18n.js
│   ├── public/
│   ├── .env
│   └── package.json
└── server/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── uploads/
    ├── .env
    └── package.json
```

---

## 🔒 Security & Validation

- JWT Authentication
- Protected Routes
- Input sanitization
- XSS tested and blocked
- `.gitignore` excludes:
  - `node_modules/`
  - `.env`
  - `uploads/`

---

## ✅ Tests & Linting

- ESLint configured (warnings shown in dev)
- Manual testing for XSS, broken flows, error states
- Functional walkthrough completed
- ✅ [View Test Cases](https://docs.google.com/spreadsheets/d/1JxjDCgZzWt1wLzD_GaY5iQwSrTi79P9cJu3IOs5nuRw/edit?gid=1426625858#gid=1426625858)

---

## 👤 Author

**Dylan O'Callaghan**  
Final Year Computer Science – TUD Dublin  
GitHub: [@dylancallaghan](https://github.com/dylancallaghan)

---

## 📸 Screenshots 

# Register View
![Register View](https://raw.githubusercontent.com/dylanocallaghan/FYP_main/main/client/public/screenshots/3d8df458-5533-4dea-baf6-54d432c47311.png)

# Listing Detials View
![Listing Detials View](https://raw.githubusercontent.com/dylanocallaghan/FYP_main/main/client/public/screenshots/0ab33bd2-81dd-4b75-a113-08375b915dd1.png)

# Admin Dashboard
![Admin Dashboard](https://raw.githubusercontent.com/dylanocallaghan/FYP_main/main/client/public/screenshots/4ffcbd7f-f8b5-427e-9488-83e095779611.png)

# New Listing View
![New Listing View](https://raw.githubusercontent.com/dylanocallaghan/FYP_main/main/client/public/screenshots/6761bae2-733e-4a20-ab19-e4b542fab579.png)

# Chat Inobx View
![Chat Inobx View](https://raw.githubusercontent.com/dylanocallaghan/FYP_main/main/client/public/screenshots/6a8372ef-eb3b-4651-8c2b-e641935053b8.png)

# Dashboard View
![Dashboard View](https://raw.githubusercontent.com/dylanocallaghan/FYP_main/main/client/public/screenshots/92df24b2-4922-446c-bf28-5ee523753905.png)

# Dashboard View
![Dashboard View](https://raw.githubusercontent.com/dylanocallaghan/FYP_main/main/client/public/screenshots/92df24b2-4922-446c-bf28-5ee523753905.png)

# Matches View
![Matches View](https://raw.githubusercontent.com/dylanocallaghan/FYP_main/main/client/public/screenshots/bf32fb0f-3c5a-4231-9921-fd36d1ca7d02.png)
