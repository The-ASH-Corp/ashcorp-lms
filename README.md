# Ash-Corp LMS

Welcome to the Ash-Corp Learning Management System (LMS). This repository contains the complete source code for a full-stack, production-ready LMS designed with a modern tech stack.

## 🚀 Architecture Overview

This project is a monorepo-style structure, separated into a distinct `frontend` and `backend`, with a unified deployment pipeline orchestrated via Docker and PM2.

- **Frontend**: A Next.js (App Router) application built with React 19, Tailwind CSS v4, Redux Toolkit, and Shadcn UI.
- **Backend**: A robust Express server using TypeScript, MongoDB (Mongoose), AWS S3 for media storage, and Razorpay for payment processing.
- **Deployment**: Multi-stage Docker build utilizing PM2 auto-healing capabilities in production.

## 📂 Repository Structure

```text
ashcorp-lms/
├── backend/               # Express.js REST API
│   ├── src/               # Backend source code
│   └── package.json       # Backend dependencies & scripts
├── frontend/              # Next.js Application
│   ├── app/               # Next.js App Router
│   ├── components/        # Reusable UI components
│   └── package.json       # Frontend dependencies & scripts
├── Dockerfile             # Multi-stage production Dockerfile
├── docker-compose.yml     # Local development orchestration
└── ecosystem.config.js    # PM2 production process manager config
```

## 🛠️ Quick Start (Local Development)

### Prerequisites
- Node.js (v20+ recommended)
- Docker Desktop (optional, but recommended for full stack run)
- MongoDB instance (local or Atlas)

### Running with Docker (Easiest)

You can spin up both the frontend and backend using Docker Compose. Make sure you have your `.env` files set up in both `frontend` and `backend` directories.

```bash
docker-compose up --build
```
- **Frontend** will be accessible at: `http://localhost:3000`
- **Backend API** will be accessible at: `http://localhost:5000`

### Running Manually

To run the components individually without Docker, please refer to their respective READMEs:
- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## 🚢 Production Deployment

The project includes a multi-stage `Dockerfile` tailored for a production environment. 

### How it works:
1. **Base Stage**: Prepares the Node 20 Alpine image.
2. **Backend Builder**: Compiles the TypeScript Express backend.
3. **Frontend Builder**: Builds the optimized Next.js production bundle.
4. **Runner Stage**: 
   - Copies production artifacts.
   - Installs PM2 globally.
   - Starts both applications using `ecosystem.config.js`.

### PM2 Process Manager (`ecosystem.config.js`)
The `ecosystem.config.js` file manages the applications in production, ensuring they stay alive, autorestart on crashes, and handle memory limits.
- **ashcorp-backend**: Runs `dist/index.js` on port 5000.
- **ashcorp-frontend**: Runs Next.js server on port 3000.

## 🤝 Contribution Guidelines

1. Always branch off from the main branch.
2. Ensure you add any required environment variables to both `.env.example` and the respective README if you introduce new services.
3. Use descriptive commit messages.

---

For deeper insights, explore the specific documentation located in the `frontend` and `backend` folders.
