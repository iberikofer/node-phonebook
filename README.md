# 📱 Phonebook REST API

A robust and secure RESTful API for managing personal contacts, built with **Node.js**, **Express**, and **MongoDB (Mongoose)**. Features user authentication with JWT, email verification via Nodemailer/Mailtrap, avatar processing with Multer & Sharp, rate limiting, and full CRUD operations for contacts.

---

## 🚀 Features

- **User Authentication & Authorization**:
  - Secure registration with password hashing via `bcrypt`.
  - Email verification workflow with unique verification tokens.
  - Resend verification email functionality.
  - JWT-based authentication for protected routes.
  - User profile management and session control (logout).
- **Avatar Management**:
  - Automatic default avatar generation via `Gravatar`.
  - Custom avatar image upload (handled by `multer`).
  - Automatic avatar resizing and formatting to 250x250px using `sharp`.
- **Contact Management (CRUD)**:
  - Create, read, update, and delete contacts.
  - User-isolated contact lists (users can only access and modify their own contacts).
  - Mark/unmark contacts as favorite (`PATCH /api/contacts/:id/favorite`).
  - Contact pagination (`page`, `limit`) and status filtering (`favorite=true|false`).
  - Duplicate phone number prevention per user.
- **Security & Reliability**:
  - Request payload validation using `Joi`.
  - Security headers configured with `helmet`.
  - Cross-Origin Resource Sharing enabled via `cors`.
  - IP-based rate limiting on sensitive auth endpoints and general API routes (`express-rate-limit`).
  - HTTP request logging via `morgan`.

---

## 🛠️ Tech Stack

- **Runtime & Framework**: [Node.js](https://nodejs.org/) (ES Modules), [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication & Security**: [JSON Web Token (JWT)](https://jwt.io/), [bcrypt](https://github.com/kelektiv/node.bcrypt.js), [Helmet](https://helmetjs.github.io/), [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit)
- **Validation**: [Joi](https://joi.dev/)
- **File & Media Handling**: [Multer](https://github.com/expressjs/multer), [Sharp](https://sharp.pixelplumbing.com/), [Gravatar](https://github.com/emerleite/node-gravatar)
- **Email Service**: [Nodemailer](https://nodemailer.com/) (Mailtrap integration)
- **Code Quality**: [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)

---

## 📁 Project Structure

```text
node-phonebook/
├── controllers/          # Route controller logic
│   ├── contactsController.js
│   └── usersController.js
├── mail/                 # Email transport & templates
│   └── transport.js
├── middleware/           # Custom Express middlewares
│   ├── auth.js           # JWT authentication middleware
│   ├── avatar.js         # Multer configuration for file uploads
│   ├── rateLimiter.js    # Rate limiting configs
│   └── validateBody.js   # Joi schema validation middleware
├── models/               # Mongoose database schemas
│   ├── contactsModel.js
│   └── usersModel.js
├── public/               # Static assets
│   └── avatars/          # Processed user avatar images
├── routes/
│   └── api/              # API Route definitions
│       ├── contacts.js
│       ├── index.js
│       └── users.js
├── tmp/                  # Temporary upload storage
├── validation/           # Joi validation schemas
│   ├── contactFavoriteSchema.js
│   ├── contactValidationSchema.js
│   ├── emailVerificationSchema.js
│   ├── userLoginSchema.js
│   └── userRegistrationSchema.js
├── app.js                # Express app setup and middleware chain
├── db.js                 # MongoDB connection handler
├── example.env           # Environment variables template
├── package.json          # Project metadata & dependencies
└── server.js             # Server entry point
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) database instance (local or MongoDB Atlas)
- [Mailtrap](https://mailtrap.io/) account (for email verification testing in development)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/iberikofer/github-test.git node-phonebook
   cd node-phonebook
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory by copying `example.env`:
   ```bash
   cp example.env .env
   ```

   Fill in your actual configuration:
   ```env
   PORT=3000
   DB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key
   MAILTRAP_USER=your_mailtrap_user
   MAILTRAP_PASSWORD=your_mailtrap_password
   MAILTRAP_EMAIL=your_mailtrap_inbox_email
   ```

---

## 🚦 Running the Application

- **Development mode** (with native file watching):
  ```bash
  npm run start:dev
  ```

- **Production mode**:
  ```bash
  npm start
  ```

- **Run linter**:
  ```bash
  npm run lint
  ```

- **Fix linter errors**:
  ```bash
  npm run lint:fix
  ```

---

## 📡 API Endpoints

All API endpoints are prefixed with `/api`.

### 👤 Users & Authentication (`/api/users`)

| Method | Endpoint | Auth | Rate Limit | Description |
| :--- | :--- | :---: | :---: | :--- |
| `POST` | `/api/users/register` | No | 10 req/15 min | Register a new user and send verification email |
| `GET` | `/api/users/verify/:verifyToken` | No | - | Verify user email address with verification token |
| `POST` | `/api/users/verify` | No | 10 req/15 min | Resend verification email |
| `POST` | `/api/users/login` | No | 10 req/15 min | Log in user and receive JWT token |
| `POST` | `/api/users/logout` | **Yes** | Standard | Log out current user (invalidates token) |
| `GET` | `/api/users/current` | **Yes** | Standard | Retrieve profile info of current authenticated user |
| `PATCH` | `/api/users/avatar` | **Yes** | Standard | Upload and update current user avatar (`multipart/form-data`) |

#### Registration Request Example
`POST /api/users/register`
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "strongPassword123",
  "subscription": "starter"
}
```

#### Login Request Example
`POST /api/users/login`
```json
{
  "email": "jane@example.com",
  "password": "strongPassword123"
}
```

---

### 📇 Contacts (`/api/contacts`)

> 🔒 **All contact routes require authentication.** Include the Bearer token in the `Authorization` header:  
> `Authorization: Bearer <your_jwt_token>`

| Method | Endpoint | Query Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/contacts` | `page` (default: 1), `limit` (default: 20), `favorite` (`true`/`false`) | Get all contacts for the authenticated user |
| `GET` | `/api/contacts/:id` | - | Get contact by ID |
| `POST` | `/api/contacts` | - | Create a new contact |
| `PUT` | `/api/contacts/:id` | - | Update all fields of an existing contact |
| `PATCH` | `/api/contacts/:id/favorite` | - | Update the `favorite` status of a contact |
| `DELETE` | `/api/contacts/:id` | - | Delete a contact |

#### Add Contact Request Example
`POST /api/contacts`
```json
{
  "name": "Alex Smith",
  "email": "alex@example.com",
  "phone": "(123) 456-7890",
  "favorite": false
}
```

#### Update Favorite Status Example
`PATCH /api/contacts/:id/favorite`
```json
{
  "favorite": true
}
```

---

## 🖼️ Static Files

Static avatar images are served at:
```
http://localhost:3000/avatars/<avatar_filename>
```

---

## 🛡️ License

This project is licensed under the **ISC License**.