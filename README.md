# AI Email Reply Generator

A full-stack web application that generates professional email responses using AI.

## Live Demo

- **Frontend** → Vercel
  - https://email-generator-frontend-seven.vercel.app/
- **Backend** → Render
  - https://email-generator-gauw.onrender.com
- **Database** → MongoDB Atlas

## Features

- 🤖 AI-generated replies using GPT-3.5 Turbo
- 🎭 Tone customization (Professional, Friendly, Formal, Apologetic, Short)
- 📜 Reply history with preview & delete
- 🔐 JWT authentication (signup/login)
- 📋 One-click copy to clipboard
- 💾 Save & revisit previous replies

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, Vite, TailwindCSS, Axios |
| Backend | Node.js, Express |
| Database | MongoDB |
| AI | OpenAI GPT-3.5 Turbo |
| Auth | JWT |

## Project Structure

```
ai-email-reply-generator/
├── frontend/
│   ├── src/
│   │   ├── components/   (Sidebar, AppLayout, ProtectedRoute)
│   │   ├── pages/        (Landing, Auth, Dashboard, Generator, History)
│   │   ├── context/      (AuthContext)
│   │   └── services/     (api.js with Axios)
│   └── index.html
│
└── backend/
    ├── routes/           (auth.js, email.js)
    ├── controllers/      (authController.js, emailController.js)
    ├── models/           (User.js, EmailReply.js)
    ├── middleware/       (auth.js — JWT guard)
    └── server.js
```

## Screenshots

<img width="1918" height="992" alt="image" src="https://github.com/user-attachments/assets/e0c5551f-c8fb-422f-8b05-eda12908eb2a" />
<img width="1905" height="983" alt="image" src="https://github.com/user-attachments/assets/9a6a8522-fd99-40ac-b4ae-fcac67073b71" />
<img width="1916" height="1015" alt="image" src="https://github.com/user-attachments/assets/71e1aef6-d702-4bf2-9884-d75c4dcd59c3" />
<img width="1915" height="996" alt="image" src="https://github.com/user-attachments/assets/9ecdf75a-b6eb-4105-9002-0ecdfaf7670e" />

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key

### Backend

```bash
cd backend
npm install
# Edit .env with your MONGODB_URI and OPENAI_API_KEY
node server.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173` — API proxied to `http://localhost:5000`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| POST | /api/generate-reply | Generate AI reply |
| POST | /api/save-reply | Save reply to DB |
| GET | /api/history | Get user's reply history |
| DELETE | /api/history/:id | Delete a reply |

