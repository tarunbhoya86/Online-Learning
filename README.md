# Online Learning Platform

## Overview
This project is a comprehensive **Online Learning Platform** designed to connect students with mentors and courses. It features a modern React-based frontend and a robust Node.js/Express backend with MongoDB. The platform supports multiple user roles (Students, Mentors, Admins) and provides distinct experiences for each.

## Tech Stack

### Frontend
- **Framework:** [React](https://react.dev/) (v19)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router DOM](https://reactrouter.com/)
- **State Management:** React Context API (`StudentContext`, `DataContext`)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/)
- **ODM:** [Mongoose](https://mongoosejs.com/)

## Project Structure
The project is organized into two main directories:

- **`frontend/`**: Contains the Client-side React application.
- **`backend/`**: Contains the Server-side API and database models.

## Key Features

### 🎓 Student Features
- **Course Browsing:** View available courses and detailed course information.
- **Course Enrollment:** Checkout process for purchasing courses.
- **Learning Dashboard:** Dedicated student dashboard to track progress.
- **Course Player:** Interactive interface for taking courses (`/course/:id/learn`).
- **Mentor Discovery:** Browse and view mentor profiles.

### 🛡️ Admin Panel
A fully functional admin dashboard located at `/admin` to manage the platform:
- **Dashboard:** Overview of platform statistics.
- **User Management:** Manage Students, Mentors, and Admins (`/admin/users`).
- **Mentor Management:** Specific view for managing mentor profiles (`/admin/mentors`).
- **Course Management:** Create, update, and delete courses (`/admin/courses`).
- **Settings:** Platform configuration.

### 🔐 Authentication & Roles
- **User Roles:** The system supports 'Student', 'Mentor', and 'Admin' roles.
- **Secure Authentication:** Sign-in and Registration functionality for new users.

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- MongoDB instance running locally or in the cloud.

### Installation

1.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```

2.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

The frontend will typically run on `http://localhost:5173` and the backend on a configured port (usually 5000 or 8080).
