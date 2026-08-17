# Ash-Corp LMS - Backend

The backend of the Ash-Corp LMS is a robust RESTful API built with Express.js, TypeScript, and MongoDB. It handles user authentication, course management, file uploads to AWS S3, and payment processing via Razorpay.

## 🛠️ Tech Stack

- **Framework**: Express.js (v5)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens) & bcrypt
- **Cloud Storage**: AWS S3 (via `@aws-sdk/client-s3` & `multer-s3`)
- **Payments**: Razorpay Integration
- **Emails**: Nodemailer
- **API Documentation**: Swagger UI (`swagger-jsdoc`, `swagger-ui-express`)
- **Security**: Helmet, CORS

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js and MongoDB installed on your machine.

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the `backend` directory based on the following required variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.eedadl3.mongodb.net/
FRONTEND_URL=http://localhost:3000
JWT_SECRET=YourSuperSecretJWTKey
NODE_ENV=development

# AWS S3 Configuration
AWS_REGION=eu-north-1
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_BUCKET_NAME=ashacademylmscontent

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# SMTP Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# OTP & Notifications
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=5
EXAM_PASS_NOTIFICATION_EMAIL=admin@example.com
```

*(Note: Never commit actual secrets to version control. The above is a template.)*

### Available Scripts

- `npm run dev`: Starts the server in development mode using `tsx watch` for hot-reloading.
- `npm run build`: Compiles the TypeScript source code to standard JavaScript in the `dist/` directory.
- `npm start`: Runs the compiled production server (`node dist/index.js`).
- `npm run lint`: Runs ESLint to check for code quality.
- `npm run format`: Formats code using Prettier.
- `npm run create-admin`: A utility script to quickly generate an admin user in the database.

## 📖 Architecture & Features

- **Authentication Flow**: Supports JWT-based authentication, password hashing with `bcrypt`, and OTP generation for secure actions.
- **AWS S3 Integration**: Uses `multer` and `multer-s3` for streaming direct uploads (like course thumbnails, videos, and PDFs) to AWS S3. Also implements presigned URLs for secure access.
- **Payment Gateway**: Integrates Razorpay for seamless course enrollments and transaction verification.
- **Email Service**: Uses Nodemailer to dispatch welcome emails, OTPs, and exam notifications.
- **API Documentation**: Accessible via Swagger. When the server is running, you can typically view the docs at `/api-docs` (depending on router configuration).

## 💡 Development Guidelines

- Keep routes, controllers, and services cleanly separated in the `src/` folder.
- Always use Zod or Mongoose validation for incoming requests.
- Handle all async operations using standard try/catch blocks and utilize the central error handling middleware.
