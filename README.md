# IRCTC Neo

A redesign concept for the IRCTC railway booking platform. The goal was to take one of the most used but visually outdated websites in India and rebuild it with a modern interface, smooth interactions, and a proper full-stack setup — while keeping all the core functionality intact.

This is a portfolio project. It is not affiliated with IRCTC or Indian Railways in any way, and no real bookings or payments are processed.

---

## What is this project

IRCTC is India's official railway booking portal used by millions of people daily. The existing platform works, but the UI is cluttered and the experience is dated. This project is a ground-up redesign that keeps the same features but presents them in a much cleaner, faster, and more enjoyable interface.

The project is split into two parts — a React frontend that handles everything the user sees, and a Django backend that handles authentication. The frontend works on its own with mock data, so the backend is only needed if you want the login and registration to actually function.

---

## Features

**Booking**
- Search trains between any two stations with a live autocomplete dropdown that searches by station name, code, or city
- Filter results by train type (Rajdhani, Shatabdi, Express, etc.) and sort by departure time or price
- View seat availability per class with availability badges (Available, RAC, Waitlist, Sold Out)
- Quick route chips for popular city pairs so you can load a route in one click
- Recent searches are saved and shown as chips below the search form
- Advanced options panel for Divyaang concession, Railway Pass, and Flexible Date

**PNR and Charts**
- PNR status checker with a 10-digit input and an animated progress indicator
- Charts and vacancy lookup by train number and journey date

**Authentication**
- Login with a real JWT-based backend — tokens are stored locally and used for authenticated requests
- Registration form with server-side validation and proper error messages shown per field
- Agent login flow with a confirmation screen and a 6-digit OTP input
- The login modal transitions smoothly between all these states without any layout jumps

**UI and Experience**
- Dark and light mode with the preference saved to localStorage
- English and Hindi language toggle — all UI strings switch instantly without a page reload
- Live clock in the navbar showing the current time updated every second
- Scrolling announcements banner with categorised railway alerts
- Animated stat counters (daily trains, passengers, stations) that trigger when they scroll into view
- Toast notifications for every user action — searching, swapping stations, loading routes, etc.
- Cinematic splash screen on first load with a progress bar

---

## Tech stack

**Frontend**

| What | Technology |
|---|---|
<<<<<<< HEAD
| Framework | React 19 |
| Language | TypeScript 6 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 12 |
=======
| Framework | React |
| Language | TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
>>>>>>> 8f72c0ca7124ad665873dcc5f951fe537bc9bd5e
| Icons | Lucide React |
| Fonts | Outfit, Plus Jakarta Sans, JetBrains Mono (Google Fonts) |

**Backend**

| What | Technology |
|---|---|
| Framework | Django 5 |
| API | Django REST Framework |
| Auth | djangorestframework-simplejwt |
| CORS | django-cors-headers |
| Database | SQLite |

---

## Folder structure

```
irctc-neo/
│
├── public/
│   ├── irctc-logo.png              # Logo used in the navbar, splash, and hero
│   └── indian-train-bg.png         # Hero background image
│
├── backend/                        # Django backend
│   ├── core/
│   │   ├── serializers.py          # Handles registration validation
│   │   ├── views.py                # /me/ and /register/ views
│   │   └── urls.py
│   ├── settings.py                 # JWT config, CORS, database
│   ├── urls.py                     # Root URL configuration
│   ├── requirements.txt
│   └── manage.py
│
├── src/
│   ├── components/
│   │   ├── AmbientButton.tsx       # The glowing CTA button with tooltip
│   │   ├── AncillaryServices.tsx   # The services section with 3D tilt cards
│   │   ├── BookingEngine.tsx       # Main booking form with all three tabs
│   │   ├── Footer.tsx              # Site footer
│   │   ├── InteractiveHeading.tsx  # Hero heading with the light sweep effect
│   │   ├── LiveAlerts.tsx          # Scrolling alerts banner
│   │   ├── LiveClock.tsx           # Real-time clock in the navbar
│   │   ├── LoginModal.tsx          # Multi-step auth modal
│   │   ├── Navbar.tsx              # Top navigation bar
│   │   ├── SearchResultsModal.tsx  # Train search results
│   │   ├── SplashScreen.tsx        # Loading screen on first visit
│   │   └── ThemeProvider.tsx       # Dark/light mode context
│   │
│   ├── data/
│   │   └── mockData.ts             # All mock stations, trains, alerts, classes
│   │
│   ├── i18n/
│   │   ├── translations.ts         # English and Hindi strings
│   │   └── LanguageProvider.tsx    # Language context and toggle
│   │
│   ├── lib/
│   │   └── utils.ts                # Small helper functions
│   │
│   ├── App.tsx                     # Root component and hero layout
│   ├── index.css                   # All global styles and CSS design tokens
│   └── main.tsx                    # Entry point
│
├── index.html
├── vite.config.ts
├── tsconfig.app.json
└── package.json
```

---

## Running the frontend

You need Node.js 20 or higher installed on your machine.

```bash
git clone https://github.com/adityasharmass12/IRCTC-Neo.git
cd IRCTC-Neo
npm install
npm run dev
```

That's it. Open http://localhost:5173 and the app will be running. Everything — the booking form, search results, PNR checker, dark mode, language toggle — works without the backend. The only thing that won't work without the backend is actually logging in or registering an account.

To build for production:

```bash
npm run build
npm run preview
```

---

## Running the backend

The backend is a standard Django project. No virtual environment is set up — just install the dependencies directly and run it.

You need Python 3.10 or higher.

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API will be running at http://localhost:8000.

If you want access to the Django admin panel, create a superuser first:

```bash
python manage.py createsuperuser
```

Then visit http://localhost:8000/admin and log in with those credentials.

---

## API reference

| Method | Endpoint | Needs auth | What it does |
|---|---|---|---|
| POST | `/api/token/` | No | Login — returns an access token and a refresh token |
| POST | `/api/token/refresh/` | No | Exchange a refresh token for a new access token |
| POST | `/api/register/` | No | Create a new user account |
| GET | `/api/me/` | Yes | Returns the logged-in user's id, username, and email |

Authentication uses Bearer tokens. After login, the access token is stored in `localStorage` and sent with requests as `Authorization: Bearer <token>`.

The access token expires after 60 minutes. The refresh token lasts 1 day.

---

## Backend environment variables

The backend works out of the box for local development without any configuration. For production, you should set these:

```
DJANGO_SECRET_KEY=replace-this-with-a-long-random-string
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=yourdomain.com
```

---

## How the design system works

All colors, spacing, and visual tokens are defined as CSS custom properties in `src/index.css`. This is what makes the dark/light mode switch instant — there is no JavaScript involved in changing colors, just a `data-theme` attribute swap on the `<html>` element.

The main color tokens:

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--clr-primary` | `#1a3a5c` | `#4A82B8` | Buttons, links, borders |
| `--clr-accent` | `#E87733` | `#F09040` | CTAs, highlighted text |
| `--clr-success` | `#138808` | `#22C55E` | Confirmations |
| `--clr-danger` | `#C0392B` | `#EF4444` | Errors and alerts |
| `--clr-bg` | `#F0F2F5` | `#0D1520` | Page background |
| `--clr-surface` | `#FFFFFF` | `#141E2E` | Cards and panels |

Fonts used:
- **Outfit** — headings and large display text
- **Plus Jakarta Sans** — all UI labels, body text, buttons
- **JetBrains Mono** — PNR numbers, train codes, timestamps

---

## How translations work

All UI text lives in `src/i18n/translations.ts` as two plain objects — one for English, one for Hindi. The `LanguageProvider` wraps the app and exposes a `t` object via React context. Any component that needs translated text just does:

```ts
const { t } = useLang()
// then use t.bookTicket, t.searchTrains, etc.
```

To add a new string, add the key to the `TranslationStrings` interface, then add the value in both the `en` and `hi` objects. That's the whole system.

---

## How the login modal works

The modal has four possible states managed as a simple string variable: `login`, `register`, `agent-confirm`, and `agent-otp`. Each state renders a different form inside the same modal container. Framer Motion's `layout` prop handles the height change automatically so the modal grows and shrinks smoothly as you move between states.

The `AnimatePresence` component handles the slide-in and slide-out transitions between states — each new state slides in from the right and the old one slides out to the left (or vice versa when going back).

On successful login, the JWT tokens are saved to localStorage and the navbar updates to show the account menu.

---

## Disclaimer

<<<<<<< HEAD
The IRCTC name, logo, and branding are property of Indian Railway Catering and Tourism Corporation Ltd. Indian Railways branding belongs to the Ministry of Railways, Government of India. This project has no affiliation with either of them. It was built for learning and portfolio purposes only.
=======
The IRCTC name, logo, and branding are property of Indian Railway Catering and Tourism Corporation Ltd. Indian Railways branding belongs to the Ministry of Railways, Government of India. This project has no affiliation with either of them. It was built for learning and portfolio purposes only.
>>>>>>> 8f72c0ca7124ad665873dcc5f951fe537bc9bd5e
