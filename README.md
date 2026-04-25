# IRCTC Neo

A redesign concept for the IRCTC railway booking platform. Built with React, TypeScript, and Django — focused on clean UI, smooth animations, and a better overall user experience than the original.

> This is a portfolio/educational project. It has no affiliation with IRCTC or Indian Railways, and no real bookings or payments are processed.

---

## What it does

The app replicates the core features of IRCTC with a much cleaner interface:

- Search for trains between stations with autocomplete
- Check PNR status
- View seat availability and chart status
- Browse ancillary services like eCatering, Retiring Rooms, and Tourism packages
- Login and register via a real JWT-authenticated backend
- Switch between English and Hindi at any time
- Toggle between dark and light mode

---

## Tech used

**Frontend**
- React 19 with TypeScript
- Vite for bundling
- Tailwind CSS v4 for styling
- Framer Motion for animations
- Lucide React for icons

**Backend**
- Django 5 with Django REST Framework
- JWT authentication via simplejwt
- SQLite for local development

---

## Running it locally

### Frontend

You need Node.js 20 or higher.

```bash
git clone https://github.com/adityasharmass12/IRCTC-Neo.git
cd IRCTC-Neo
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Backend (optional)

The frontend runs fine on its own with mock data. You only need the backend if you want the login and registration to actually work.

You need Python 3.10 or higher.

```bash
cd backend
python -m venv venv
source venv/bin/activate      # on Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API runs at http://localhost:8000.

---

## Project layout

```
irctc-neo/
├── public/                  # Static assets (logo, background image)
├── backend/                 # Django API
│   ├── core/                # Auth views and serializers
│   ├── settings.py
│   └── requirements.txt
└── src/
    ├── components/          # All React components
    ├── data/                # Mock train and station data
    ├── i18n/                # English and Hindi translations
    └── index.css            # Global styles and design tokens
```

---

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/token/` | Login and get JWT tokens |
| POST | `/api/token/refresh/` | Refresh an expired token |
| POST | `/api/register/` | Create a new account |
| GET | `/api/me/` | Get the logged-in user's details |

---

## A few things worth noting

- All animations use spring physics (via Framer Motion) instead of fixed easing curves. It makes interactions feel more natural.
- The entire color system lives in CSS custom properties, so dark/light mode switching is instant with no flicker.
- The login modal has four states (Login, Register, Agent Confirmation, OTP) and transitions smoothly between them without any layout jumps.
- Translations are loaded from a simple dictionary file — adding a new language is just adding another object to `src/i18n/translations.ts`.

---

## Disclaimer

The IRCTC name, logo, and branding belong to Indian Railway Catering and Tourism Corporation Ltd. This project is not affiliated with them in any way. It was built purely for learning and portfolio purposes.
