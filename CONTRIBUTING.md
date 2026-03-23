# Contributing to MediBook

Thank you for your interest in contributing! Here's how to get started.

## Development Setup

### Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/doctor-appointment-system.git
cd doctor-appointment-system
```

### Branch Naming
- `feature/your-feature-name`
- `fix/bug-description`
- `docs/what-you-updated`

### Commit Style (Conventional Commits)
```
feat: add SMS notification on booking
fix: correct slot booking race condition
docs: update README setup steps
test: add admin route test cases
refactor: extract email service to helper
```

## Running Locally

```bash
# Terminal 1 — Backend
cd backend && npm install && npm run seed && npm run dev

# Terminal 2 — Frontend
cd frontend && npm install && npm start
```

## Running Tests

```bash
cd backend && npm test
```

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- Include tests for new API routes
- Update README if you add new setup steps
- Ensure `npm test` passes before submitting

## Project Structure

```
backend/
  models/       # Mongoose schemas — User, Doctor, Appointment
  routes/       # Express route handlers
  middleware/   # Auth guards (protect, adminOnly, doctorOnly)
  config/       # Mailer setup
  tests/        # Jest + Supertest API tests
  seeder.js     # Demo data seeder

frontend/src/
  pages/        # Route-level components
  components/   # Reusable UI (Navbar, etc.)
  context/      # AuthContext (JWT state)
  utils/        # Axios API calls
```
