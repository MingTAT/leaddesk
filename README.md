# LeadDesk

A minimal CRM for managing customer leads, follow-ups, and sales stages.

LeadDesk was built as Project 01 of my SaaS Lab — a series of small applications for exploring how real software products are designed, built, and deployed.

## What it does

LeadDesk helps a small business keep track of:

- Customer leads
- Lead sources
- Sales stages
- Customer needs
- Follow-up history
- Customer status changes
- Lead filtering

## Workflow

A customer moves through a simple CRM pipeline:

`New → Contacted → Interested → Won / Lost`

Each customer can also have multiple follow-up interactions such as:

- Phone
- WeChat
- Meeting
- Other

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Vercel

## Data Model

### customers

Stores the current state of each customer.

Fields include:

- `name`
- `phone`
- `source`
- `status`
- `need`
- `created_at`
- `updated_at`

### interactions

Stores the history of customer communication.

Each interaction belongs to one customer through `customer_id`.

Relationship:

`Customer 1 → N Interactions`

## Features

- Create customers
- View customer list
- View customer details
- Add follow-up records
- Update customer status
- Filter customers by sales stage
- CRM stage counts
- Dynamic customer routes

## Local Development

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SECRET_KEY=your_supabase_secret_key
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Database

The database schema is stored in:

```text
supabase/schema.sql
```

Run the SQL in `supabase/schema.sql` inside your Supabase project before starting the application.

## Project Structure

```text
leaddesk/
├── src/
│   ├── app/
│   │   ├── customers/
│   │   │   ├── [id]/
│   │   │   ├── new/
│   │   │   ├── actions.ts
│   │   │   └── page.tsx
│   │   └── page.tsx
│   └── lib/
│       └── supabase/
│           └── server.ts
├── supabase/
│   └── schema.sql
├── .env.example
├── package.json
└── README.md
```

## Environment Variables

This project requires:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SECRET_KEY=your_supabase_secret_key
```

Do not commit your real `.env.local` file or secret keys to GitHub.

## Security Note

This project is currently a learning/demo application and does not include user authentication.

The server uses a Supabase secret key to access the database, so this version should only be used with fake or demo data.

Do not use real customer information or sensitive personal data in the public deployment.

A production-ready version should add:

- Authentication
- User accounts
- Organization accounts
- Role-based permissions
- Row Level Security policies
- Audit logging

## Development Flow

This project was built through the following process:

```text
Create Next.js project
↓
Initialize local Git repository
↓
Connect GitHub repository
↓
Create Supabase database
↓
Design relational schema
↓
Read customer data
↓
Create customers
↓
Create dynamic customer pages
↓
Add follow-up interactions
↓
Update customer status
↓
Filter customers
↓
Build production version
↓
Deploy
```

## SaaS Lab

**Project 01 — LeadDesk**

This project focuses on understanding the complete lifecycle of a small web application:

- Data modeling
- CRUD
- Relational databases
- Server Components
- Server Actions
- Dynamic routing
- Business workflows
- Git and GitHub
- Production builds
- Deployment

## Status

Project 01 is intentionally kept small.

The goal is not to build a full commercial CRM, but to complete the full path from an idea to a working deployed application.