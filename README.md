# 📚 BookNook – Small Online Library

BookNook is a small online library management application where users can explore books, add books, borrow available copies, and manage their borrowed books. It provides a simple and responsive interface for book lovers.

## Live Website: https://booknook-client-sepia.vercel.app/
**Server URL:https://booknook-server-2t5l.onrender.com
- **Client Repository:https://github.com/shamimreja-dev/booknook-client
- **Server Repository:https://github.com/shamimreja-dev/booknook-server



## ✨ Features

- 🔐 User authentication with Better Auth.
- 🔑 Email and password login.
- 🌐 Google social login.
- 👤 User profile management with name and profile photo updates.
- 📚 Browse all available books.
- 🔍 View detailed information about individual books.
- ➕ Add new books to the library.
- ✏️ Edit and delete books added by the logged-in user.
- 📖 Borrow books with borrow and return dates.
- 📦 Track available book copies.
- ↩️ Return borrowed books.
- 🚫 Prevent duplicate borrowing of the same book.
- 🎠 Responsive Swiper hero slider.
- 🆕 Display the latest six books on the homepage.
- 📱 Responsive design for mobile, tablet, and desktop.
- ⚡ Loading states, error messages, and custom 404 page.

## 🛠️ Technologies Used

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- DaisyUI 5
- Better Auth
- Axios
- Swiper
- React Hot Toast
- React Icons

### Backend
- Express.js
- MongoDB
- Better Auth
- JWT Authentication

## 📁 Project Structure

```text
booknook-client/
├── public/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── HeroSlider.tsx
│   │   ├── books/
│   │   ├── add-book/
│   │   ├── my-books/
│   │   ├── my-profile/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   └── layout.tsx
│   └── lib/
│       └── auth-client.ts
├── package.json
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_CLIENT_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the project folder

```bash
cd booknook-client
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure the Backend

Make sure the BookNook backend is running on:

```text
http://localhost:5000
```

The frontend authentication client is configured to connect to this backend.

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## 🔒 Authentication

BookNook uses Better Auth for authentication. Protected features require a logged-in user. The backend validates JWT tokens for protected API operations.

## 📌 Important Notes

- The backend must be running for book and borrowing operations.
- Google login requires valid OAuth configuration on the backend.
- For deployment, configure the production backend URL and trusted origins.
- Never commit passwords, API secrets, database credentials, or private environment files.

## 👨‍💻 Author

**BookNook – Small Online Library**

Built as a library management project using Next.js, Express.js, MongoDB, and Better Auth.

---

Made with ❤️ for book lovers.