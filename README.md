# QuickTask - Intelligent Task Manager

QuickTask is a modern, full-stack task management application that combines a robust MERN (MongoDB, Express, React, Node.js) architecture with a Python-based analytics microservice. It features a premium, responsive UI built with Tailwind CSS v4 and Framer Motion.

## 🚀 Features

### Frontend (Client)

- **Modern UI/UX**: Dark-themed, premium interface with smooth animations and transitions.
- **Task Management**: Create, Read, Update, and Delete (CRUD) tasks with ease.
- **Dashboard**: Real-time visual statistics (Bar Charts, Pie Charts) powered by Recharts.
- **Smart Filtering**: Filter tasks by Status (Todo, In Progress, Completed) and Priority (High, Medium, Low).
- **Responsive Design**: Mobile-optimized layout with accessible touch targets.
- **UX Enhancements**:
  - Skeleton loaders for smooth data fetching.
  - Interactive "Confirm Delete" modals.
  - Form validation with visual feedback.
  - Styled toast notifications for user actions.

### Backend (Server)

- **Secure Authentication**: JWT-based auth with password hashing (Bcrypt).
- **REST API**: Well-structured endpoints for Tasks and Authentication.
- **Middleware**: Protected routes and error handling layers.
- **Database**: MongoDB integration with Mongoose schemas.

### Analytics Service (Python)

- **Microservice Architecture**: Dedicated Python (FastAPI) service for heavy data processing.
- **Data Analysis**: Aggregates user productivity data and task trends.
- **Scalable**: Built to handle data-intensive operations separately from the main Node backend.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, Axios, React Router v7, Recharts, Lucide React.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JSON Web Token (JWT).
- **Analytics**: Python 3.10+, FastAPI, PyMongo, Uvicorn.
- **Tools**: Concurrent (for running multiple servers), Prettier.

---

## 📦 Installation & Setup

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- MongoDB (Local or Atlas URI)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/quicktask.git
cd quicktask
```

### 2. Setup Server (Node.js)

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quicktask
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

### 3. Setup Client (React)

```bash
cd ../client
npm install
```

(No `.env` required for client by default, it proxies to localhost:5000 via Vite config)

### 4. Setup Analytics (Python)

```bash
cd ../analytics
# Optional: Create virtual environment
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the `analytics` directory:

```env
MONGODB_URI=mongodb://localhost:27017/quicktask
PORT=8000
```

---

## 🏃‍♂️ Running the Application

You can run each service individually, or use the root `package.json` to run them all (if configured).

**Option A: Run Individually (Recommended for Dev)**

1. **Terminal 1 (Server):**

   ```bash
   cd server
   npm run dev
   ```

2. **Terminal 2 (Analytics):**

   ```bash
   cd analytics
   python -m uvicorn main:app --reload --port 8000
   ```

3. **Terminal 3 (Client):**
   ```bash
   cd client
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

---

## 📂 Project Structure

```
QuickTask/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components (Modal, Spinner, etc.)
│   │   ├── context/        # React Context (Auth)
│   │   ├── pages/          # Application Pages (Dashboard, Tasks)
│   │   └── services/       # API integration
├── server/                 # Node.js Backend
│   ├── controllers/        # Route logic
│   ├── middleware/         # Auth & Error middleware
│   ├── models/             # Mongoose Models
│   └── routes/             # API Routes
└── analytics/              # Python Microservice
    └── main.py             # FastAPI entry point
```

## 📝 API Documentation

### Auth Routes

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Authenticate user

### Task Routes

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Dashboard

- `GET /api/dashboard` - Get aggregated stats

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
