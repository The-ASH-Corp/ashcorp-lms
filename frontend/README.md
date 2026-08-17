# Ash-Corp LMS - Frontend

The frontend of the Ash-Corp LMS is a modern, responsive web application built with Next.js (App Router), offering a seamless experience for students and administrators.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 & Framer Motion (Animations)
- **UI Components**: Shadcn UI (Radix UI + Tailwind)
- **State Management**: Redux Toolkit (RTK) & React-Redux
- **Form Handling & Validation**: React Hook Form with Zod resolvers
- **Rich Text Editor**: Tiptap Editor
- **Data Tables**: TanStack React Table
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js installed on your machine.

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the `frontend` directory. The application requires the following keys:

```env
# The Base URL for the Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# The Base URL for Image/Media resolution
NEXT_PUBLIC_IMAGE_URL=http://localhost:5000

# Razorpay Key for Client-side payment initialization
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Available Scripts

- `npm run dev`: Starts the Next.js development server on `localhost:3000`.
- `npm run build`: Creates an optimized production build.
- `npm start`: Starts the Next.js production server.
- `npm run lint`: Runs ESLint to identify code issues.

## 📖 Architecture & Features

### Next.js App Router (`app/`)
This project leverages the modern Next.js App Router. Pages are mapped to directories containing a `page.tsx`. Layouts, loading states, and error boundaries are collocated with the routes.

### State Management (`lib/redux/`)
Redux Toolkit is utilized for global state management. RTK Query might be used for data fetching, but always ensure that the API URL points to `NEXT_PUBLIC_API_BASE_URL`.

### UI Component Library (`components/`)
We use **Shadcn UI**, which provides beautifully designed, accessible components built on top of Radix UI primitives. These components are fully customizable via Tailwind CSS. Check `components.json` for the configuration.

### Forms & Validation
Complex forms (e.g., login, registration, course creation) are built using **React Hook Form**. Validation is strongly typed and enforced using **Zod** schemas.

### Rich Text Editing
The platform features a fully-fledged rich text editor utilizing **Tiptap**, specifically equipped for formatting course content (bold, links, alignments, images).

## 💡 Development Guidelines

- **Component Creation**: Reusable components should be placed in `components/`. Use Shadcn CLI to add new primitives when needed.
- **Styling**: Adhere to Tailwind utility classes. For custom animations, use Framer Motion (`framer-motion` / `motion`).
- **Server vs Client Components**: Understand the difference in Next.js 16. By default, components in the `app/` directory are React Server Components. Use the `"use client"` directive at the top of the file only when you need client-side interactivity, hooks (useState, useEffect), or event listeners.
