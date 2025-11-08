# Dina Public School Website (React + Vite)

A school website built with React, Vite, Tailwind, and Firebase (Auth, Firestore, Storage). Includes an Admin Dashboard to manage:

- Redirect links (Admissions, Results)
- PDF documents (Notices, Syllabus, Exams, Holidays, Others)
- Media library (Photos/Videos)

## 1) Prerequisites
- Node 18+
- Firebase project (Console)
- Firebase CLI: `npm i -g firebase-tools`

## 2) Install & Run
```bash
npm install
npm run dev
```

## 3) Configure Firebase
Edit `src/firebase.js` with your project config (already added in this repo). Ensure these services are enabled in Firebase Console:
- Authentication → Sign-in method → Email/Password
- Firestore Database
- Storage

## 4) Create Admin User (no self-registration)
There is no admin registration on the site. Create admins manually in Firebase:

1. Create an Auth user
   - Go to Firebase Console → Authentication → Users → Add user
   - Set email and password for the admin account

2. Add the admin record in Firestore
   - Go to Firestore → Start collection: `admins`
   - Document ID: the admin user’s `uid` (copied from Authentication → Users)
   - Fields (example):
     - `email`: string → the admin’s email
     - `active`: boolean → `true`

This site restricts `/admin-dashboard` via:
- Firebase Auth (must be signed in)
- Firestore doc at `admins/{uid}` with `active !== false`

## 5) Security Rules
Rules are included at project root:
- `firestore.rules` (public read for site content; authenticated writes)
- `storage.rules` (public read; authenticated writes)

Deploy rules (optional):
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

## 6) Hosting
Initialize Hosting once (creates `firebase.json` and `.firebaserc`, already present):
```bash
firebase login
npm run build
firebase deploy
```
If you deploy to a named site (e.g., `dinapublicschool`):
```bash
# one-time site creation (if needed)
firebase hosting:sites:create dinapublicschool
# optional: map local target
firebase target:apply hosting dinapublicschool dinapublicschool
# deploy to that target
firebase deploy --only hosting:dinapublicschool
```

## 7) Admin Dashboard Features
Path: `/admin-dashboard` (protected by auth + Firestore `admins` check)

- Redirect Links
  - Stores `admissionUrl` and `resultUrl` in `config/links`
  - Public pages read these links:
    - `/admission` (AdmissionRedirect)
    - `/results` (ResultsRedirect)

- PDFs
  - Upload to Storage, index in Firestore `documents` with fields: `title`, `category`, `url`, `path`, `createdAt`
  - Public list at `/notices` with category filters

- Media Library (Photos/Videos)
  - Upload to Storage under `media/photos` or `media/videos`
  - Indexed in Firestore `media` with: `title`, `type`, `url`, `path`, `createdAt`

## 8) Common Commands
```bash
# Dev server
npm run dev

# Build
npm run build

# Deploy hosting
firebase deploy
```

## 9) Troubleshooting
- Import path errors in Vite: ensure pages import Firebase via `../firebase`
- Access denied to dashboard: confirm Auth login and Firestore doc exists at `admins/{uid}` with `active: true`
- Storage download blocked: verify Storage rules and that the file exists at the stored `path`
