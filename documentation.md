# Student-Teacher Appointment Booking System

## 📖 Overview
This is a full-stack web application designed to facilitate appointment bookings between students and teachers. Built using the **MERN** stack (MongoDB, Express.js, React, Node.js), it features role-based access control, real-time notifications, and a modern UI powered by Vite and Bootstrap.

**Repository:** [https://github.com/harish00078/student-teacher-appointment](https://github.com/harish00078/student-teacher-appointment)

## 🏗 Architecture
The application is divided into two main parts:
- **BACKEND/**: A Node.js/Express REST API that handles data persistence, authentication, and business logic.
- **FRONTEND/**: A React Single Page Application (SPA) served via Vite that consumes the backend API.

## 🛠 Tech Stack

### Frontend
- **Framework:** React (Vite)
- **Styling:** Bootstrap, React-Bootstrap
- **HTTP Client:** Axios
- **Graphics:** Three.js (@react-three/fiber) for 3D background elements
- **Routing:** React Router DOM

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Logging:** Winston
- **Validation:** Express-Validator

## 🚀 Key Features
- **Role-Based Access Control (RBAC):** Distinct dashboards and capabilities for **Students**, **Teachers**, and **Admins**.
- **Appointment Management:** Students can book available slots; Teachers can approve/reject them.
- **User Management:** Admins can oversee user accounts and approvals.
- **Secure Authentication:** JWT-based stateless authentication with password hashing.

---

## 🔐 Admin Credentials
**Use these credentials to log in as the initial Administrator after running the seed script.**

| Field    | Value               |
| :------- | :------------------ |
| **Email**| `admin@example.com` |
| **Password**| `admin123`       |

> **Note:** These are created by running `node seed.js` in the `BACKEND` directory.

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB Atlas URI or local MongoDB instance

### 1. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd BACKEND
npm install
```

Create a `.env` file in `BACKEND/` with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

**Seeding the Database (Create Admin):**
```bash
node seed.js
```
*This command creates the default admin user listed above.*

Start the server:
```bash
npm run server
# or for development with nodemon:
npm run dev
```

### 2. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd FRONTEND
npm install
```

Start the development server:
```bash
npm run dev
```
The application will typically be available at `http://localhost:5173`.

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **Auth** | `/api/auth/register` | Register a new user |
| | `/api/auth/login` | Login and receive JWT |
| **Admin** | `/api/admin/users` | Get all users |
| | `/api/admin/approve-teacher/:id` | Approve a teacher account |
| **Teacher**| `/api/teacher/profile` | Get teacher profile |
| **Appointments**| `/api/appointments/book` | Book a new appointment |
| | `/api/appointments/my-appointments` | Get user's appointments |

## 📂 Project Structure
```
/
├── BACKEND/
│   ├── controllers/   # Request handlers
│   ├── models/        # Mongoose schemas (User, Teacher, Appointment)
│   ├── routes/        # API route definitions
│   └── middleware/    # Auth and error handling
└── FRONTEND/
    ├── src/
    │   ├── components/# Reusable UI components
    │   ├── pages/     # Main view pages (Dashboards, Login)
    │   ├── services/  # API service calls
    │   └── context/   # React Context (Auth state)
```
