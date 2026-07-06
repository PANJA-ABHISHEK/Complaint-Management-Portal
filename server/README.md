# Complaint Management Portal - Backend API

## 📋 Overview

RESTful API backend built with Node.js + Express.js for the Complaint Management Portal. Uses JWT authentication, role-based access control, file uploads, email notifications, and input validation.

## 🚀 Quick Start

```bash
cd server
npm install
npm run dev
```

Server runs at **http://localhost:5000**

API docs at **http://localhost:5000/api**

## 🔐 Demo Credentials

| Role  | Email               | Password     |
|-------|---------------------|--------------|
| User  | user@example.com    | password123  |
| Admin | admin@example.com   | password123  |

## 📁 Folder Structure

```
server/
├── config/
│   ├── db.js           # Database (in-memory / MongoDB ready)
│   ├── env.js          # Environment variables
│   └── multer.js       # File upload config
├── controllers/
│   ├── authController.js
│   ├── complaintController.js
│   ├── adminController.js
│   └── notificationController.js
├── middleware/
│   ├── auth.js         # JWT protect + role authorize
│   ├── errorHandler.js # Global error handler
│   └── validate.js     # Express-validator middleware
├── routes/
│   ├── authRoutes.js
│   ├── complaintRoutes.js
│   ├── adminRoutes.js
│   └── notificationRoutes.js
├── utils/
│   ├── email.js        # Nodemailer + templates
│   └── helpers.js      # ApiError, asyncHandler, apiResponse
├── uploads/            # File upload directory
├── .env
├── package.json
└── server.js           # Express app entry point
```

## 🔗 API Endpoints

### Auth
| Method | Endpoint                    | Access  | Description            |
|--------|-----------------------------|---------|------------------------|
| POST   | `/api/auth/register`        | Public  | Register new user      |
| POST   | `/api/auth/login`           | Public  | Login & get JWT        |
| GET    | `/api/auth/me`              | Private | Get current user       |
| PUT    | `/api/auth/profile`         | Private | Update profile         |
| PUT    | `/api/auth/change-password` | Private | Change password        |

### Complaints (User)
| Method | Endpoint                  | Access  | Description                |
|--------|---------------------------|---------|----------------------------|
| GET    | `/api/complaints`         | Private | Get my complaints          |
| POST   | `/api/complaints`         | Private | Create complaint (+files)  |
| GET    | `/api/complaints/stats`   | Private | Get my stats               |
| GET    | `/api/complaints/:id`     | Private | Get complaint by ID        |
| PUT    | `/api/complaints/:id`     | Private | Update own complaint       |
| DELETE | `/api/complaints/:id`     | Private | Delete own complaint       |

### Admin
| Method | Endpoint                              | Access | Description            |
|--------|---------------------------------------|--------|------------------------|
| GET    | `/api/admin/stats`                    | Admin  | Dashboard stats        |
| GET    | `/api/admin/complaints`               | Admin  | All complaints         |
| PUT    | `/api/admin/complaints/:id/status`    | Admin  | Update status          |
| PUT    | `/api/admin/complaints/:id/assign`    | Admin  | Assign complaint       |
| GET    | `/api/admin/users`                    | Admin  | All users              |
| GET    | `/api/admin/users/:id`                | Admin  | User by ID             |
| DELETE | `/api/admin/users/:id`                | Admin  | Delete user            |

### Notifications
| Method | Endpoint                          | Access  | Description         |
|--------|-----------------------------------|---------|---------------------|
| GET    | `/api/notifications`              | Private | Get notifications   |
| PUT    | `/api/notifications/:id/read`     | Private | Mark as read        |
| PUT    | `/api/notifications/read-all`     | Private | Mark all as read    |

## 🔧 Environment Variables

See `.env` file for all configurable options (JWT secret, SMTP, file upload limits, etc.)
