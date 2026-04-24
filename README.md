# Muscle Fit Irwin Website

Simple, mobile-first website for gym meal prep and smoothies.

## What Is Built

- Home page with quick actions
- Meal Prep page with interactive build-a-bowl order form
- Smoothies page with two categories (Tropical and Clean Fuel)
- Live pricing in the meal prep form
- Pickup options:
	- Earliest available
	- Pick a day/time
- Cart-first meal prep checkout flow:
	- Build meal and add/update cart
	- Redirect to Clover for payment
	- Return to checkout completion page
	- Auto-send paid order email to store and receipt email to customer

## Checkout And Email Setup

Create `.env.local` from `.env.example` and set:

- `RESEND_API_KEY`
- `ORDER_FROM_EMAIL`
- `ORDER_TO_EMAIL`
- `ORDER_SIGNING_SECRET`
- `NEXT_PUBLIC_APP_URL`

Also set your Clover URL in `lib/site-data.ts` under `clover.orderUrl`.

## Placeholder Mode (Launch Before Vendor Details)

You can deploy now using placeholder values and enable live checkout later.

1. Keep `clover.orderUrl` and `clover.embedUrl` empty in `lib/site-data.ts`.
2. Use placeholder contact values in `lib/site-data.ts`.
3. Copy `.env.example` to `.env.local` and keep temporary values until vendor credentials arrive.

In this mode:

- Meal prep form and cart work.
- Checkout button is shown as coming soon.
- Payment redirect and order emails stay disabled until real Clover and Resend details are set.

## Single Editable Menu Source

Update all business/menu content in one file:

- `lib/site-data.ts`

That file controls:

- Smoothie categories/items/calories/add-ons
- Meal prep options/prices/cutoff text
- Contact info and links

## Run Locally In VS Code

```bash
npm.cmd install
npm.cmd run dev
```

Open:

- `http://localhost:3000` (or next available port if 3000 is already in use)

## Validation

```bash
npm.cmd run lint
npm.cmd run build
```

## Push To GitHub

From this project folder:

```bash
git init
git add .
git commit -m "Initial Muscle Fit website"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

## Deploy To Vercel (No Domain Needed)

1. Push project to GitHub.
2. In Vercel, click `Add New -> Project`.
3. Import your GitHub repository.
4. Keep defaults for Next.js and click `Deploy`.
5. Vercel gives you a `.vercel.app` URL immediately.

You can add a custom domain later when ready.
