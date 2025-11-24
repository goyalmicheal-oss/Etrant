# Application Architecture

## 1. Overview
This application is a modern, full-stack web platform built with **Next.js 15**, designed for educational purposes (quizzes, daily digests, exam groups). It leverages **Server Side Rendering (SSR)** and **Server Components** for performance, with real-time features powered by **Pusher**.

## 2. Technology Stack

### Core Framework
-   **Next.js 15 (App Router):** The backbone of the application, handling routing, API endpoints, and rendering.
-   **TypeScript:** Ensures type safety across the entire codebase.

### Database & ORM
-   **PostgreSQL (Neon):** Serverless Postgres database.
-   **Drizzle ORM:** Type-safe ORM for interacting with the database.
-   **Schema:** Defined in `lib/db/schema.ts`.

### Authentication
-   **NextAuth.js (v5 Beta):** Handles user authentication.
-   **Provider:** Google OAuth.
-   **Adapter:** Drizzle Adapter (persists sessions in Postgres).

### UI & Styling
-   **Tailwind CSS:** Utility-first CSS framework.
-   **Radix UI:** Headless UI primitives for accessible components.
-   **Framer Motion:** Animation library.
-   **Lucide React:** Icon set.

### Real-time & External Services
-   **Pusher:** Real-time WebSocket functionality (Group Chat, Typing Indicators).
-   **Razorpay:** Payment processing.
-   **AI Integration:** Vercel AI SDK & Google GenAI for generating content.
-   **PostHog:** Analytics.

## 3. Project Structure

```
├── app/
│   ├── (protected)/       # Routes requiring authentication (e.g., /groups, /daily-digest)
│   ├── (root)/            # Public marketing pages (Landing page)
│   ├── api/               # Backend API routes (Next.js Route Handlers)
│   ├── auth/              # Auth related pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
├── lib/
│   ├── db/                # Database connection and schema
│   ├── pusher/            # Pusher server and client config
│   └── utils.ts           # Helper functions
├── hooks/                 # Custom React hooks (e.g., use-group-messages)
├── public/                # Static assets
└── middleware.ts          # Route protection logic
```

## 4. Key Features & Data Flow

### A. Authentication Flow
1.  User clicks "Sign in with Google".
2.  **NextAuth** handles the OAuth handshake.
3.  On success, a session is created in the `sessions` table.
4.  **Middleware** (`middleware.ts`) checks for a valid session cookie on protected routes.

### B. Group Chat (Real-time)
1.  **Frontend:** `useGroupMessages` hook subscribes to a Pusher channel (`group-[id]`).
2.  **Sending:** User sends a message -> `POST /api/groups/[id]/messages`.
3.  **Backend:**
    -   Saves message to `group_messages` table (Postgres).
    -   Triggers a Pusher event (`new-message`).
4.  **Receiving:** All connected clients receive the event and update state instantly.

### C. Database Schema Overview
-   **Users:** Core user profile.
-   **Exam Groups:** Groups for specific exams (JEE, NEET).
-   **Group Members:** Junction table linking Users <-> Groups.
-   **Group Messages:** Chat history.
-   **Daily Digest:** AI-generated daily summaries.
-   **Files & MCQs:** Uploaded study materials and generated questions.

## 5. Deployment
-   **Docker:** The application is containerized using a `Dockerfile`.
-   **Environment Variables:** Managed via `.env` (see `.env.example`).
-   **Build Command:** `npm run build` (Next.js build).

## 6. Getting Started for Developers
1.  **Clone the repo.**
2.  **Install dependencies:** `npm install` or `pnpm install`.
3.  **Setup Environment:** Copy `.env.example` to `.env.local` and fill in keys (DB, Auth, Pusher).
4.  **Run Database Migrations:** `npm run db:push`.
5.  **Start Dev Server:** `npm run dev`.
