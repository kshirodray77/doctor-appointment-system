# 🏥 MediBook — Doctor Appointment Booking System

A full-stack web application that allows patients to book appointments with doctors, manage schedules, and receive email confirmations.

## 🚀 Features

### Patient Side
- Browse and search doctors by specialization, name, or availability
- Book, reschedule, or cancel appointments
- Email confirmation on booking
- View upcoming and past appointments

### Doctor Side
- Manage availability slots
- View daily/weekly schedule
- Mark appointments as completed or cancelled

### Admin Side
- Dashboard with daily appointment stats
- Manage doctors and patients
- Generate reports

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Email | Nodemailer + Gmail SMTP |
| Styling | CSS Modules + Custom Design System |

## 📁 Project Structure

```
doctor-appointment-system/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route-level page components
│   │   ├── context/          # React Context (Auth, Appointments)
│   │   └── utils/            # API helpers, date formatters
│   └── package.json
├── backend/
│   ├── routes/               # Express route handlers
│   ├── models/               # Mongoose schemas
│   ├── middleware/           # Auth middleware
│   ├── config/               # DB & email config
│   └── server.js
└── README.md
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Gmail account for email notifications

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/doctor-appointment-system.git
cd doctor-appointment-system
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your MongoDB URI, JWT secret, Gmail credentials
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Environment Variables

Create a `.env` file in `/backend`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/medibook
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
```

## 🌱 Seed Demo Data

```bash
cd backend
npm run seed          # populate with demo doctors, patients, appointments
npm run seed:clear    # wipe the database
```

## 🧪 Running Tests

```bash
cd backend
npm test              # runs full Jest + Supertest API test suite
```

Tests cover:
- Auth — register, login, duplicate email rejection, token validation
- Doctors — listing, filtering by specialization, slot management
- Appointments — booking, listing, cancellation, slot conflict
- Admin — stats dashboard, role-based access guards

## ⚙️ CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs on every push:
1. **Backend Tests** — spins up MongoDB service container, runs Jest suite
2. **Frontend Build** — verifies React build compiles without errors
3. **Security Audit** — flags high-severity npm vulnerabilities

## 📮 Postman Collection

Import `MediBook.postman_collection.json` into Postman to test all endpoints. Tokens auto-save after login via test scripts.

## 📸 Screenshots

> Login → Patient Dashboard → Book Appointment → Email Confirmation

## 🧪 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@medibook.com | admin123 |
| Doctor | dr.sharma@medibook.com | doctor123 |
| Patient | patient@medibook.com | patient123 |

## 📄 License

MIT License — free to use and modify.
