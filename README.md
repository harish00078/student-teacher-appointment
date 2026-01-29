# Student-Teacher Appointment Booking System

A full-stack MERN application for scheduling and managing appointments between students and teachers with a modern React frontend and a robust Node.js/Express backend.

**GitHub Repository:** [https://github.com/harish00078/student-teacher-appointment](https://github.com/harish00078/student-teacher-appointment)

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (Local or Atlas)

### 2. Backend Setup
```bash
cd BACKEND
npm install
```
Create a `.env` file in `BACKEND/` with the following variables:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
- Seed the database to create the admin user:
  ```bash
  node seed.js
  ```
- Start the server:
  ```bash
  npm run dev
  ```

### 3. Frontend Setup
```bash
cd FRONTEND
npm install
npm run dev
```

## 🔐 Default Admin Credentials
| Email | Password |
| :--- | :--- |
| `admin@example.com` | `admin123` |

## 🛠 Features
- **Role-Based Access:** Specialized dashboards for Admins, Teachers, and Students.
- **Approval System:** Admin moderation for teacher/student registration.
- **Appointment Tracking:** Real-time status updates (Pending, Approved, Rejected).
- **Modern UI:** Styled with Bootstrap and enhanced with Three.js 3D backgrounds.

## 📂 Project Structure
- `/BACKEND`: Express API, Mongoose Models, and Auth Middleware.
- `/FRONTEND`: React (Vite) application with Context API for state management.

## 📄 Documentation
For detailed information on API endpoints, database schemas, and advanced configuration, please refer to [documentation.md](./documentation.md).
