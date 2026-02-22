# MatrixO

MatrixO is a modern React-based OKR (Objectives and Key Results) management platform that helps organizations align, track, and achieve their strategic goals.

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Redux Toolkit** - State management with simplified Redux setup
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Data Visualization** - Integrated D3.js and Recharts for powerful data visualization
- **Form Management** - React Hook Form for efficient form handling
- **Animation** - Framer Motion for smooth UI animations
- **Testing** - Jest and React Testing Library setup

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

```
matrixo/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.

## 📦 Deployment

Build the application for production:

```bash
npm run build
```

## 🗄️ Database Setup (PostgreSQL)

- Install PostgreSQL 14+ and create a database (e.g., `trackline`).
- Import the schema:
  - `psql -U <user> -d trackline -f db/schema.sql`
- Add a connection string in environment variables:
  - `DATABASE_URL=postgres://<user>:<password>@<host>:<port>/trackline`
- Recommended hosting options:
  - Vercel Postgres or a managed Postgres (RDS, Azure, etc.).

### Using from Serverless Functions

- Add `DATABASE_URL` to Vercel Project → Settings → Environment Variables.
- Example Node.js connection with `pg`:
  - `import { Client } from 'pg';`
  - `const client = new Client({ connectionString: process.env.DATABASE_URL });`
  - `await client.connect();`
  - `const { rows } = await client.query('SELECT 1');`
  - `await client.end();`

## 🔧 Prisma ORM

- Install: `npm install @prisma/client pg && npm install -D prisma`
- Initialize client: `npx prisma generate`
- Configure datasource in `prisma/schema.prisma` (already created).
- Introspect existing SQL schema: `npm run prisma:pull` (requires `DATABASE_URL`).
- Generate client after changes: `npm run prisma:generate`.
- Migrations for future changes:
  - Dev: `npm run prisma:migrate:dev -- --name <change>`
  - Prod: `npm run prisma:migrate:deploy`
- Verify connectivity: open `/api/dbHealth` on your deployment; returns `{ ok: true }` when `DATABASE_URL` is set.

### API Endpoints
- `GET /api/objectives`
  - Query params: `organizationId`, `year`, `quarter`, `status`, `limit`, `offset`.
  - Returns: `{ count, data: Objective[] }` sorted by `updated_at DESC`.
- Uses Prisma `$queryRaw` to avoid needing generated models before introspection.

## ☁️ Supabase Integration

- Frontend SDK: `@supabase/supabase-js` initialized in `src/utils/supabaseClient.js`.
- Required env (Vite):
  - `VITE_SUPABASE_URL=https://<project-ref>.supabase.co`
  - `VITE_SUPABASE_ANON_KEY=<anon-key>`
- Usage example:
  - `import { supabase } from './src/utils/supabaseClient';`
  - `const { data, error } = await supabase.from('objectives').select('*').limit(10);`
- Postgres via Prisma:
  - Set `DATABASE_URL` to Supabase pooled URI:
    - `postgres://<user>:<password>@db.<project-ref>.supabase.co:6543/postgres?sslmode=require&pgbouncer=true&connection_limit=1`
  - Then run: `npm run prisma:pull` and `npm run prisma:generate`.

### Seed Schema in Supabase

- Use the Supabase-ready script at `db/supabase_seed.sql` (uses `pgcrypto` → `gen_random_uuid()` defaults).
- Steps:
  - Open Supabase Dashboard → SQL Editor → New Query.
  - Paste the contents of `db/supabase_seed.sql`.
  - Click Run. Confirm tables/enums created under `public`.
- Verify data:
  - `SELECT * FROM organizations;` → should contain `Default Org`.
  - `SELECT * FROM quarters;` → should contain 4 rows for the current year.
- Optional quick test from frontend:
  - `const { data, error } = await supabase.from('quarters').select('*')`
  - If using the anon key, ensure RLS policies allow read access (see below).

### RLS Policies (important)

- For production, enable RLS and write tenant-aware policies based on `organization_id`.
- For initial testing with anon key, you may temporarily allow read access:
  - In SQL Editor:
    - `ALTER TABLE quarters ENABLE ROW LEVEL SECURITY;`
    - `CREATE POLICY read_quarters FOR SELECT ON quarters USING (true);`
  - Repeat similar read policies for `objectives` while testing.
  - Remove/replace with tenant-aware policies before going live.

### Data Model Overview

- Core tables: `organizations, departments, teams, users, quarters, objectives, key_results, initiatives`.
- Update tables: `objective_updates, key_result_updates, initiative_updates` for referential integrity and cascade.
- Attachments: linkable to objectives, key results, and initiatives.
- Enums: `status_enum, priority_enum, metric_type_enum, initiative_type_enum, update_type_enum, sentiment_enum, role_enum`.

## 🚀 Go-Live Checklist

- Configure environment variables
  - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for frontend.
  - `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for serverless functions (if used).
  - `VITE_SITE_URL` set to your production domain (e.g., `https://<owner>.github.io/trackline`).
  - `OPENAI_API_KEY` for the AI Assistant chat endpoint (`/api/chat`).
  - Add secrets in GitHub → Settings → Secrets and variables → Actions for CI builds.
- Clean demo data in Supabase (keep `organizations` = 'Default Org')
  - Open Supabase → SQL Editor → New Query → paste `db/cleanup_demo.sql` → Run.
  - Optional: to remove the default org row as well, run:
    - `DELETE FROM organizations WHERE name = 'Default Org';`
  - Targeted cleanup (preserve users/teams):
    - In Supabase → SQL Editor → run `db/cleanup_objectives_preserve_people.sql`.
    - Adjust the org name at the top of the file if needed.
    - This deletes objectives, key results, initiatives, related updates, and attachments linked to those items, while keeping users/teams/departments.
  - Admin API endpoint with preserve option:
    - Deploy `api/cleanupDemo.js` with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set.
    - Call `POST /api/cleanupDemo` with body `{ "orgName": "Default Org", "preservePeople": true }` and an `Authorization: Bearer <supabase-jwt>` of an admin in the org.

## 🤖 AI Assistant

- Endpoint: `POST /api/chat`
  - Body: `{ messages: Array<{ role, content }>, question: string }`
  - Returns: `{ answer: string }`

- Setup:
  - Set `OPENAI_API_KEY` in your deployment environment (e.g., Vercel → Project → Settings → Environment Variables).
  - Local dev: requests will hit the dev serverless runtime; ensure env is available if testing production behavior.

- UI Pages:
  - `AI Assistant`: `/ai-assistant` — chat UI for Q&A.
  - `Knowledge Base`: `/knowledge-base` — searchable articles.
  - `Training Guide`: `/training-guide` — step-by-step onboarding.

- Notes:
  - The assistant focuses on navigation, KPIs, Balanced Scorecard usage, and module drill-downs.
  - For richer, data-grounded answers, consider adding retrieval (RAG) against internal docs.
    - Response includes counts; users/teams/departments are left intact when `preservePeople` is true.
- Verify Auth configuration
  - Enable Google provider and set Client ID/Secret.
  - Add Additional Redirect URLs:
    - `https://<owner>.github.io/trackline/company-okr-dashboard`
    - `http://localhost:<port>/company-okr-dashboard` for local dev.
  - If using email OTP, set `VITE_SITE_URL` and update email redirect URLs accordingly.
- Enable and audit RLS
  - Ensure row-level policies enforce tenant isolation via `organization_id`.
  - Remove any permissive demo read policies before launch.
- Frontend cleanup
  - Removed debug Supabase info and connectivity checks from Login.
  - Confirm navigation, routes, and titles reflect production naming.
- CI/CD
  - GitHub Actions deploy workflow is generic and uses repository owner/name for `VITE_SITE_URL` and `VITE_BASE_PATH`.
  - First push to `main` will trigger build and Pages deployment.

### Post‑Launch Verification
- Sign in via Google on production domain; ensure no popup blockers.
- Confirm `objectives`, `key_results`, `initiatives` tables are empty for your org.
- Validate RLS by attempting cross‑org access (should be blocked).
- Open `/api/dbHealth` (if applicable) returns `{ ok: true }`.

## 🙏 Acknowledgments

- Built By [MM Shareef](https://mmshareef.com)
- Powered by React and Vite
- Styled with Tailwind CSS

## 📅 Repository Status
- **Repository URL**: https://github.com/mmshareef24/trackline
- **Last Updated**: 2026-02-01


