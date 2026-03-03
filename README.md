<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Service Finance Manager (SFM)

SFM is a React + Vite dashboard for managing service-business finances: invoices, expenses, clients, tax vault, and an accountant-only view. Data is stored locally in the browser (localStorage) and all amounts are shown in CAD.

## Run Locally

**Prerequisites:** Node.js (LTS recommended)

1. Install dependencies  
   `npm install`
2. Start the dev server  
   `npm run dev`  
   Then open the printed `http://localhost:3000` URL in your browser.

## Main Features

- **Dashboard**: Live totals for revenue, outstanding invoices, and expenses, with charts and recent activity.
- **Invoices**:
  - Create, edit, delete invoices with line items, tax, and notes.
  - Status management (Paid, Sent, Draft, Overdue).
  - **Preview as PDF** from the invoice list or while drafting, using the browser’s “Print → Save as PDF”.
- **Expenses**: Track expenses with categories, statuses (Pending / Verified / Flagged), and notes.
- **Clients**: Manage clients and see total billed per client based on linked invoices.
- **Tax Vault**:
  - Create/remove folders (e.g. tax years).
  - Add/edit/delete document metadata and linked transactions.
- **Accountant View**:
  - Passcode-protected, **read-only** financial summary.
  - Unlock with the passcode `techeservice` (session-based).

## Data & Persistence

- All operational data (invoices, expenses, clients, vault folders/docs) is stored in **browser localStorage** under a versioned key.
- Clearing browser storage will reset the app back to its seeded demo data.
