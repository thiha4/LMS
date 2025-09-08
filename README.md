# Library Management Backend (MERN)

## Quick Start
1. Create `.env` from `config/config.env` and fill values.
2. Install deps:
   ```bash
   npm install
   npm run dev
   ```

## Auth Endpoints
- POST /api/v1/auth/register {name,email,password}
- POST /api/v1/auth/login {email,password}
- POST /api/v1/auth/logout
- GET  /api/v1/auth/me   (cookie token required)
- POST /api/v1/auth/forgot-password {email, resetUrl?}
- POST /api/v1/auth/reset-password/:token {password}
- PUT  /api/v1/auth/update-password {oldPassword,newPassword}

## Books
- GET  /api/v1/books
- GET  /api/v1/books/:id
- POST /api/v1/books           (admin)
- PUT  /api/v1/books/:id       (admin)
- DELETE /api/v1/books/:id     (admin)

## Borrowing
- POST /api/v1/books/:bookId/issue  (member/admin) body: {days?}
- POST /api/v1/books/return/:loanId (member/admin)
- GET  /api/v1/books/me/loans/list  (member/admin)

## Admin
- GET /api/v1/admin/users      (admin)
- GET /api/v1/admin/loans      (admin)
