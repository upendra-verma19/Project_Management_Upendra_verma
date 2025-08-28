# Mini Project Manager

A full-stack mini project management app with authentication, projects, and tasks.

## Tech

- **Frontend:** Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS + Shadcn/ui + TanStack Query
- **Backend:** Node.js + Express + MongoDB (Mongoose) + JWT
- **Auth:** JWT Bearer tokens stored in `localStorage`
- **API:** RESTful endpoints, protected with JWT middleware

---

## Quick Start (Local)

### 1) Backend

```bash
cd backend
cp .env.example .env
# Edit .env  (PORT, MONGO_URI, JWT_SECRET, CLIENT_ORIGIN)
npm install
npm run dev
```

The API runs at `http://localhost:4000`.

### 2) Frontend

```bash
cd ../frontend
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.


---

## Features

- **Auth**: Register & Login (JWT). Protects API routes and the client performs simple auth checks before loading pages.
- **Projects**: CRUD for your own projects with modern UI components.
- **Tasks**: Tasks belong to a project; fields: `title`, `description`, `status (todo|in-progress|done)`, `dueDate`.
  - Filter by status and sort by due date (asc|desc).
  - Edit status inline using dropdown selects; delete tasks; create tasks.
  - Responsive design with Tailwind CSS and Shadcn/ui components.
- **UI/UX**: Modern, clean interface with proper loading states, error handling, and responsive design.

---

## REST API

Base URL: `/api`

### Auth

- `POST /auth/register` `{ name, email, password }` → `{ token, user }`
- `POST /auth/login` `{ email, password }` → `{ token, user }`

### Projects (Bearer token required)

- `GET /projects` → list user's projects
- `POST /projects` `{ title, description }` → create
- `GET /projects/:id` → get one
- `PUT /projects/:id` `{ title, description }` → update
- `DELETE /projects/:id` → delete

### Tasks (Bearer token required)

- `GET /tasks?project=:id&status=todo|in-progress|done&sortByDue=asc|desc`
- `POST /tasks` `{ project, title, description, status, dueDate }`
- `PUT /tasks/:id` (any subset of fields above)
- `DELETE /tasks/:id`

---

## Notes

- This demo stores the JWT in `localStorage` (simple). For production, consider HTTP-only cookies.
- Frontend uses TypeScript with strict type checking and modern React patterns.
- UI components are built with Shadcn/ui for consistency and accessibility.
- State management is handled by TanStack Query for server state and React hooks for local state.
- To deploy, host the backend (e.g., Render/Heroku) and the frontend (e.g., Vercel). Set `NEXT_PUBLIC_API_BASE` to your API URL.
