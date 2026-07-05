# 🏛️ Complaint Management Portal

A modern, enterprise-grade web application for registering, tracking, assigning, and resolving complaints through a centralized digital platform. Built with **React**, **Node.js**, **Express**, and **MongoDB**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.3-blue.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with httpOnly cookies
- Role-based access control (User, Officer, Admin)
- Secure password hashing with bcrypt
- Forgot/reset password via email

### 📝 Complaint Management
- Register complaints with category, priority, and attachments
- Auto-generated complaint IDs (CMP-XXXXXXX)
- Real-time status tracking with visual timeline
- File attachments (images, PDFs — up to 5MB each)
- Internal notes for officers

### 👤 User Dashboard
- Overview statistics (total, pending, in-progress, resolved)
- Recent complaints with status badges
- Notification center
- Profile management with avatar upload

### 👮 Officer Dashboard
- View assigned complaints
- Update complaint status with messages
- Add internal notes
- Track resolution progress

### 🛡️ Admin Dashboard
- System-wide analytics and statistics
- Manage all complaints — assign to officers, update status
- User management — create, edit, delete, change roles
- Department management (CRUD)
- Reports & analytics with category breakdown
- User feedback and satisfaction metrics
- CSV export functionality

### 🎨 UI/UX
- Glassmorphism design with premium aesthetics
- Dark / Light mode toggle
- Fully responsive (mobile, tablet, desktop)
- Framer Motion animations throughout
- Skeleton loading states
- Interactive stat cards with animated counters
- Color-coded priority and status badges

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS v4 | Utility-first styling |
| Framer Motion | Animations |
| React Router v6 | Client-side routing |
| React Hook Form | Form handling |
| React Hot Toast | Toast notifications |
| React Icons | Icon library |
| Axios | HTTP client |
| Recharts | Data visualization |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | HTTP framework |
| MongoDB + Mongoose | Database |
| JSON Web Tokens | Authentication |
| Bcrypt.js | Password hashing |
| Multer | File uploads |
| Nodemailer | Email service |
| Express Validator | Input validation |
| Cors + Helmet + Morgan | Security & logging |

---

## 📁 Project Structure

```
ComplaintManagementPortal/
├── client/                     # React frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/             # Images and media
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # ProtectedRoute, LoadingScreen
│   │   │   ├── layout/         # Navbar, Sidebar, Footer, ThemeToggle
│   │   │   └── ui/             # Button, Input, Modal, Card, Badge, etc.
│   │   ├── contexts/           # AuthContext, ThemeContext
│   │   ├── layouts/            # PublicLayout, AuthLayout, DashboardLayout
│   │   ├── pages/              # All pages
│   │   │   ├── admin/          # Admin dashboard, complaints, users, etc.
│   │   │   ├── auth/           # Login, Register, ForgotPassword
│   │   │   ├── errors/         # 404 page
│   │   │   ├── home/           # Landing page
│   │   │   ├── officer/        # Officer dashboard and complaint management
│   │   │   └── user/           # User dashboard, complaints, profile
│   │   ├── services/           # API service layer
│   │   ├── utils/              # Constants, helpers
│   │   ├── App.jsx             # Root component with routing
│   │   └── main.jsx            # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                     # Node.js backend
│   ├── config/                 # DB, env, multer config
│   ├── controllers/            # Route handlers
│   ├── middleware/              # Auth, validation, error handling
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express routes
│   ├── services/               # Email, notification services
│   ├── server.js               # Express app entry point
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18.x
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/PANJA-ABHISHEK/Complaint-Management-Portal.git
cd Complaint-Management-Portal
```

### 2. Setup Backend
```bash
cd server
cp .env.example .env     # Edit .env with your values
npm install
npm run dev              # Starts on http://localhost:5000
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev              # Starts on http://localhost:5173
```

### 4. Open in browser
Navigate to [http://localhost:5173](http://localhost:5173)

---

## 🔧 Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/complaint_portal
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# SMTP (optional - for email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File uploads
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/update-profile` | Update profile |
| PUT | `/api/auth/update-avatar` | Upload avatar |
| POST | `/api/auth/forgot-password` | Request password reset |
| PUT | `/api/auth/reset-password/:token` | Reset password |

### Complaints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/complaints` | Create complaint |
| GET | `/api/complaints/my` | Get user's complaints |
| GET | `/api/complaints/assigned` | Get officer's assigned |
| GET | `/api/complaints/:id` | Get complaint by ID |
| PUT | `/api/complaints/:id/status` | Update status |
| PUT | `/api/complaints/:id/assign` | Assign to officer |
| PUT | `/api/complaints/:id/notes` | Add internal note |
| POST | `/api/complaints/:id/feedback` | Submit feedback |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard statistics |
| GET | `/api/admin/complaints` | All complaints |
| GET | `/api/admin/users` | All users |
| POST | `/api/admin/users` | Create user |
| PUT | `/api/admin/users/:id` | Update user |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/departments` | All departments |
| POST | `/api/admin/departments` | Create department |
| GET | `/api/admin/reports` | Reports & analytics |
| GET | `/api/admin/feedback` | User feedback |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications |
| PUT | `/api/notifications/:id/read` | Mark as read |
| PUT | `/api/notifications/read-all` | Mark all as read |
| DELETE | `/api/notifications/:id` | Delete notification |

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **User** | Register complaints, track status, provide feedback, manage profile |
| **Officer** | View assigned complaints, update status, add internal notes |
| **Admin** | Full system access — manage users, departments, view reports, assign complaints |

---

## 🎯 Complaint Lifecycle

```
Submitted → Pending → Assigned → In Progress → Under Review → Resolved → Closed
                                                             ↘ Rejected
```

---

## 📸 Screenshots

> Coming soon — run the app locally to see the premium UI!

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Abhishek Panja**

- GitHub: [@PANJA-ABHISHEK](https://github.com/PANJA-ABHISHEK)

---

Built with ❤️ using React, Node.js, and MongoDB

## Community
Join our growing community of developers on GitHub.
