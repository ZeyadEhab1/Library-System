# Bosta 

**Bosta** is a small Library Management System API built with Node.js, Express and Prisma.

---

##  Quickstart

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL (or any database supported by Prisma)
- `npm` (comes with Node.js)

### Clone & Install

```bash
git clone <repo-url>
cd bosta
npm install
```

### Environment Variables
Create a `.env` file in the project root with at least the following variables:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your-secret-key
PORT=3000
```

### Database (Prisma)
Run migrations and generate the client:

```bash
npx prisma generate
npx prisma migrate dev --name init
```


Seed the database with sample books:

```bash
node Seeders/BookSeeder.js
```


### Running

- Development (auto-reload):

```bash
npm run dev
```

- Production / Start:

```bash
npm start
```

- Run tests:

```bash
npm test
```

- Run the overdue update job manually:

```bash
npm run job:update-overdue
```

---

## 🔧 Environment Variables (summary)
- `DATABASE_URL` - Postgres connection string
- `JWT_SECRET` - Secret used to sign auth tokens (default fallback exists in code, but set in prod)
- `PORT` - Server port (default 3000)

---

## 📡 API Reference
Base URL: `http://localhost:<PORT>/api`

Authentication: endpoints under `/api/borrowers`, `/api/checkouts`, `/api/exports`, and `/api/jobs` require a bearer token in the header:

```
Authorization: Bearer <token>
```

### auth

- POST `/api/auth/register`   public
  - Body (JSON): `{ name, email, password, phone? }`
  - Success: 201
    ```json
    {
      "message": "User created successfully",
      "token": "<jwt>",
      "user": { "id": 1, "name": "...", "email": "...", "phone": "..." }
    }
    ```
  - Errors: 400 (user exists), 422 validation errors

- POST `/api/auth/login`   public
  - Body (JSON): `{ email, password }`
  - Success: 200
    ```json
    {
      "message": "Login successful",
      "token": "<jwt>",
      "user": { "id", "name", "email", "phone" }
    }
    ```
  - Errors: 401 invalid credentials, 422 validation errors

### books

- POST `/api/books/create`   public
  - Body (JSON): `{ title, author, isbn (13 digits), available_quantity?, shelf_location }`
  - Success: 201 -> created book object

- GET `/api/books`   public
  - Query params: `page` (default 1), `limit` (default 10)
  - Success: 200 -> `{ data: [books], page, limit, total }` (returned by service)

- GET `/api/books/:id`   public
  - Success: 200 -> book object
  - 404 if not found

- PUT `/api/books/:id`   public
  - Body: partial book fields to update
  - Success: 200 -> updated book
  - 404 if not found

- DELETE `/api/books/:id`   public
  - Success: 204 No Content

### borrowers
(Requires Authorization header)

- PUT `/api/borrowers/me`   authenticated
  - Body: `{ name?, email?, password?, phone? }`
  - Success: 200 -> updated borrower

- DELETE `/api/borrowers/me`   authenticated
  - Success: 204 No Content

- GET `/api/borrowers`   authenticated
  - Success: 200 -> list of borrowers

### checkouts
(Requires Authorization header)

- POST `/api/checkouts/borrow` authenticated
  - Body: `{ isbn }` (13-digit string)
  - Success: 201 -> checkout record
    - Service will create checkout and decrement available quantity
  - Errors: validation or business rules (e.g., no available copies)

- POST `/api/checkouts/return` authenticated
  - Body: `{ isbn }`
  - Success: 200 -> `{ message: "Book returned" }`

- GET `/api/checkouts/myBooks` authenticated
  - Success: 200 -> list of borrowed books by current user

- GET `/api/checkouts/overdue` authenticated
  - Success: 200 -> list of overdue checkouts

### exports
(Requires Authorization header)

- GET `/api/exports/report?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` authenticated
  - Returns analytical report (JSON)
  - 400 if missing dates

- GET `/api/exports/export/period?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` authenticated
  - Returns CSV file download of borrowing processes in period

- GET `/api/exports/export/overdue-last-month` authenticated
  - Returns CSV file download of overdue borrows last month

- GET `/api/exports/export/all-last-month` authenticated
  - Returns CSV file download of all borrowing processes last month

### jobs
(Requires Authorization header)

- POST `/api/jobs/update-overdue-checkouts` authenticated
  - Triggers the background job to mark overdue checkouts
  - Success: 200 -> `{ message: 'Overdue checkouts update job completed successfully', result }

---

## ️ Notes & Tips
- Validation is handled by `joi` schemas in `validators/schemas.js`; invalid requests return 422.
- Authentication uses JWTs (24h expiry by default).
- CSV exports are generated temporarily on disk and sent via `res.download()`; the files are removed after download.
- Cron jobs are started automatically (see `jobs/cron.js`).

---

## Contributing
Contributions, issues and feature requests are welcome.

---

## License
ISC

