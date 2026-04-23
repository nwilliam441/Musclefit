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
- Email-based order submission (opens mail app)

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
