<div align="center">

# 🚆 IRCTC Neo — Premium Redesign

**A cinematic, high-fidelity redesign of India's railway booking platform**

Built with React 19 · Vite · Framer Motion · Tailwind CSS v4

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0050?logo=framer&logoColor=white)](https://motion.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

![Hero Section — Dark Mode](screenshots/hero-dark.png)

## ✨ Overview

**IRCTC Neo** is a conceptual, premium-grade redesign of the Indian Railway Catering and Tourism Corporation's booking portal. This project reimagines the official IRCTC platform with a cinematic visual identity, fluid micro-animations, and a world-class user experience — while faithfully preserving all the core booking functionality.

> ⚠️ **Disclaimer:** This is a UI/UX concept project for educational and portfolio purposes only. It is not affiliated with or endorsed by IRCTC or Indian Railways. No real booking functionality is implemented.

---

## 🖼️ Screenshots

<details open>
<summary><strong>🌙 Dark Mode</strong></summary>

|  Hero Section  |  Services  |
|:-:|:-:|
| ![Hero Dark](screenshots/hero-dark.png) | ![Services](screenshots/services-dark.png) |

</details>

<details open>
<summary><strong>☀️ Light Mode</strong></summary>

| Hero Section |
|:-:|
| ![Hero Light](screenshots/hero-light.png) |

</details>

<details open>
<summary><strong>🔐 Multi-Step Authentication Modal</strong></summary>

| State 1: Login | State 2: Agent Confirm | State 3: Agent OTP |
|:-:|:-:|:-:|
| ![Login](screenshots/login-state1.png) | ![Agent Confirm](screenshots/login-state2.png) | ![Agent OTP](screenshots/login-state3.png) |

</details>

---

## 🎯 Key Features

### 🎨 Visual Design
- **Cinematic Hero** — Full-bleed Indian Railways locomotive background with parallax scrolling
- **Glassmorphism** — Multi-layered frosted glass panels with gradient borders and inner glow
- **Dual Theme** — Fully theme-aware dark/light mode with CSS custom properties
- **Premium Typography** — [Unbounded](https://fonts.google.com/specimen/Unbounded) for headings, [Sora](https://fonts.google.com/specimen/Sora) for UI text
- **Mouse Spotlight** — Interactive radial gradient that follows the cursor on glass panels

### ⚡ Interactions & Animations
- **Cinematic Expand & Shine** — Heading letter-spacing expands on hover with an animated gradient light sweep (sheen) across the text
- **Parallax Text Shadow** — Text-shadow angle shifts dynamically based on cursor position
- **Ambient Glow Buttons** — LED-style ambient light that intensifies dramatically on hover
- **3D Tilt Cards** — Service cards respond to mouse movement with perspective transforms
- **Spring Physics** — All animations use `framer-motion` spring-based physics for natural feel
- **Splash Screen** — Cinematic branded loading sequence with staggered entrance

### 🔐 Authentication Modal
- **3-State Machine** — Fluid transitions between Login → Agent Confirmation → Agent OTP
- **Framer Motion `layout`** — Modal container smoothly animates its height between states
- **Floating Labels** — Input labels animate from placeholder to floating position on focus
- **6-Digit OTP Input** — Split input with auto-focus, paste support, and backspace navigation
- **Glassmorphic Tooltips** — Hover popups with backdrop blur and subtle arrow indicators

### 🧩 Functional Features
- **Booking Engine** — Station autocomplete, date picker, class/quota selectors, route chips
- **Live Clock** — Real-time formatted clock in the navbar (e.g., `Sat, 25 Apr | 10:45:30 AM`)
- **EN/HI Language Toggle** — Full internationalization with 60+ translated UI strings
- **Search Results** — Mock train results with availability badges, pricing, and class comparison
- **PNR Status** — 10-digit input with progress indicator
- **Charts & Vacancy** — Train number lookup with date selector
- **Live Alerts Marquee** — Scrolling banner with categorized railway announcements
- **Stat Counters** — Animated number counters that trigger on scroll into viewport

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + TypeScript 6 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS v4 + Vanilla CSS custom properties |
| **Animations** | Framer Motion 12 |
| **Icons** | Lucide React |
| **Fonts** | Google Fonts (Unbounded, Sora) |

---

## 📂 Project Structure

```
irctc-neo/
├── public/
│   ├── irctc-logo.png          # Official IRCTC logo
│   └── indian-train-bg.png     # Cinematic hero background
├── screenshots/                # README screenshots
├── src/
│   ├── components/
│   │   ├── AmbientButton.tsx       # LED-glow button with glassmorphic tooltip
│   │   ├── AncillaryServices.tsx   # Services section with 3D tilt cards
│   │   ├── BookingEngine.tsx       # Main booking form (3 tabs, autocomplete)
│   │   ├── Footer.tsx              # Site footer with link columns
│   │   ├── InteractiveHeading.tsx  # Cinematic Expand & Shine heading
│   │   ├── LiveAlerts.tsx          # Scrolling announcement marquee
│   │   ├── LiveClock.tsx           # Real-time clock component
│   │   ├── LoginModal.tsx          # Multi-step auth modal (3 states)
│   │   ├── Navbar.tsx              # Navigation with clock, lang toggle, theme
│   │   ├── SearchResults.tsx       # Train search results display
│   │   ├── SplashScreen.tsx        # Branded loading animation
│   │   └── ThemeProvider.tsx       # Dark/Light theme context
│   ├── data/
│   │   └── mockData.ts            # Stations, trains, classes, quotas
│   ├── i18n/
│   │   ├── translations.ts        # EN/HI translation dictionary
│   │   └── LanguageProvider.tsx    # React context for i18n
│   ├── lib/
│   │   └── utils.ts               # cn() classname utility
│   ├── App.tsx                     # Root layout + hero section
│   ├── index.css                   # Complete design system (1400+ lines)
│   └── main.tsx                    # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) ≥ 18
- npm ≥ 9 (or yarn/pnpm)

### Installation

```bash
# Clone the repository
git clone https://github.com/adityasharmass12/IRCTC-Neo.git
cd IRCTC-Neo/irctc-neo

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🎬 Design Highlights

### Glassmorphism System
The project uses a comprehensive token-based glassmorphism system with CSS custom properties that adapt to both light and dark themes:

```css
--glass-bg: rgba(255,255,255,0.04);
--glass-border-from: rgba(255,255,255,0.18);
--glass-border-to: rgba(255,255,255,0.04);
--glass-glow: rgba(74,130,184,0.12);
--glass-inner: rgba(255,255,255,0.06);
```

### Animation Philosophy
Every animation uses **spring physics** via Framer Motion — no linear easing. This creates a natural, premium feel:

```tsx
transition={{ type: "spring", stiffness: 400, damping: 25 }}
```

### Color Palette
| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `--clr-primary` | `#1a3a5c` | `#4A82B8` | Trust Blue — primary actions |
| `--clr-accent` | `#E87733` | `#F09040` | Saffron — CTAs, highlights |
| `--clr-success` | `#138808` | `#22C55E` | India Green — confirmations |

---

## 🌐 Internationalization

The app supports real-time language switching between **English** and **Hindi** with 60+ translated UI strings covering:

- Navigation labels
- Hero section text
- Booking engine (labels, placeholders, buttons)
- Services section
- Footer content
- Stats labels

---

## 📄 License

This project is for **educational and portfolio purposes only**.

- The IRCTC name, logo, and branding are trademarks of [Indian Railway Catering and Tourism Corporation Ltd](https://www.irctc.co.in/).
- This project does not process any real transactions or personal data.

---

<div align="center">

**Built with ❤️ for Indian Railways**

*A conceptual redesign demonstrating modern web technologies and premium UI/UX design*

</div>
