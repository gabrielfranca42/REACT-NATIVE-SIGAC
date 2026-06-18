# ValidaUP — Student Mobile App (SIGAC)

> The student-facing mobile application for the Integrated Complementary Activities Management System (SIGAC).

---

## 📖 Table of Contents

- [Purpose of Existence](#-purpose-of-existence)
- [Key Features](#-key-features)
- [System Design](#-system-design)
  - [Design Principles](#design-principles)
  - [Architecture Overview](#architecture-overview)
  - [Component Map](#component-map)
  - [User Flows](#user-flows)
  - [Design Tokens & Theming](#design-tokens--theming)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [API Integration](#-api-integration)
- [Related Repositories](#-related-repositories)
- [License](#-license)

---

## 🎯 Purpose of Existence

### The Problem

In Brazilian higher-education institutions (such as SENAC), students are required to accumulate a minimum number of **complementary activity hours** — attending workshops, seminars, internships, and extension projects — before they can graduate. For decades, this process has been entirely analog:

1. **Paper certificates** must be physically printed, signed, and hand-delivered to the course coordinator's office.
2. Students receive **no real-time feedback**: they drop off papers and wait days (sometimes weeks) for a response.
3. There is **no centralized tracking**: students often have no idea how many hours they have accumulated, which categories still need hours, or whether they are on track to graduate.
4. **Certificates get lost**, deadlines are missed, and the entire workflow relies on manual spreadsheets prone to human error.

### The Solution

**ValidaUP** exists to give students full ownership and visibility over their complementary activity journey. It is the **mobile arm** of the SIGAC ecosystem — purpose-built so that a student can manage their entire graduation requirement from a smartphone:

| Pain Point | How ValidaUP Solves It |
|---|---|
| Physical delivery of certificates | **Instant upload** — snap a photo or select a PDF directly from the device |
| No progress visibility | **Visual dashboard** — real-time progress bars showing approved, pending, and remaining hours per category |
| Lost documents | **Digital audit trail** — every submission is stored, timestamped, and traceable |
| Waiting for feedback in the dark | **Submission history with status** — students see Pending / Approved / Rejected in real time and can read coordinator feedback |
| No mobile-first experience | **Native app** — optimized for touch, offline-aware token storage, and platform-specific UI conventions |

### Why a Mobile App?

Students are mobile-first users. They attend events, receive certificates on the spot, and need to submit them immediately — not when they return home to a desktop computer. ValidaUP was designed for this reality: upload a certificate from the parking lot after a seminar, check your progress on the bus, and graduate on time.

---

## ✨ Key Features

- **Secure Login:** Authenticate using Student ID (Matrícula) or Email with JWT-based sessions.
- **Visual Dashboard:** Progress bars showing completion percentage of total hours and specific category requirements.
- **Document Upload:** Native file picker to select PDF or JPEG certificates directly from the device storage or cloud drives.
- **Submission History:** A detailed list of all past uploads, displaying their current status (Pending, Approved, Rejected).
- **Feedback Viewing:** Read direct comments from the coordinator regarding rejected or adjusted submissions.
- **Theme Support:** Built-in Light and Dark modes managed via React Context.
- **Native PDF Handling:** External linking to view uploaded PDF certificates safely.

---

## 🏗 System Design

### Design Principles

The mobile application was built following these core design principles:

| Principle | Application |
|---|---|
| **Separation of Concerns** | Screen components handle UI rendering; the `api.js` service layer handles all network communication; `ThemeContext` manages global visual state |
| **Offline-Ready Authentication** | JWT tokens are persisted in `AsyncStorage`, allowing the app to maintain sessions across restarts without re-authentication |
| **Progressive Disclosure** | The Dashboard shows summary metrics first; students drill down into categories only when needed |
| **Platform Agnosticism** | Built with Expo managed workflow to ensure a single codebase deploys identically to iOS and Android |
| **Fail-Safe Uploads** | File uploads use native `fetch` with `multipart/form-data` (not Axios) to avoid known React Native binary encoding bugs |

### Architecture Overview

```
┌────────────────────────────────────────────────────────────────┐
│                    ValidaUP — Mobile App                       │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   App.js (Entry Point)                    │  │
│  │           Stack Navigator (Auth + Main)                   │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                     │
│           ┌───────────────┼───────────────┐                     │
│           │               │               │                     │
│  ┌────────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐            │
│  │  Dashboard    │ │  Material   │ │  Profile    │            │
│  │  Screen       │ │  Screen     │ │  Screen     │            │
│  │              │ │             │ │             │            │
│  │ • Progress   │ │ • Upload    │ │ • User Info │            │
│  │   Bars       │ │   Form      │ │ • Logout    │            │
│  │ • Hour Stats │ │ • History   │ │ • Theme     │            │
│  └──────┬───────┘ └──────┬──────┘ └──────┬──────┘            │
│         │                │               │                     │
│         └────────────────┼───────────────┘                     │
│                          │                                     │
│              ┌───────────▼──────────┐                          │
│              │     Service Layer    │                          │
│              │                      │                          │
│              │  api.js (Axios)      │ ◄── JSON requests        │
│              │  fetch() native      │ ◄── multipart uploads    │
│              │  AsyncStorage        │ ◄── token persistence    │
│              └───────────┬──────────┘                          │
│                          │                                     │
│              ┌───────────▼──────────┐                          │
│              │  ThemeContext.js      │                          │
│              │  (React Context API) │                          │
│              │  Light / Dark modes  │                          │
│              └──────────────────────┘                          │
└────────────────────────────────────────────────────────────────┘
                           │
                    HTTPS (REST)
                           │
              ┌────────────▼────────────┐
              │   Node.js / Express 5   │
              │   Backend API           │
              │   (SIGAC Core)          │
              └────────────▼────────────┘
              ┌────────────▼────────────┐
              │      MongoDB 6.0        │
              └─────────────────────────┘
```

### Component Map

| Component | File | Responsibility |
|---|---|---|
| **Entry Point** | `App.js` | Wraps the app in `ThemeProvider`, defines Stack Navigator (Login → TabNavigator) |
| **Login Screen** | `LoginScreen.js` | Collects matrícula/email + password, calls `/auth/login`, stores JWT in AsyncStorage |
| **Dashboard Screen** | `DashboardScreen.js` | Fetches course rules + student activities, calculates approved vs required hours, renders progress bars |
| **Material Screen** | `MaterialScreen.js` | Category picker, hours input, file picker (`expo-document-picker`), native `fetch` upload, submission history list |
| **Profile Screen** | `ProfileScreen.js` | Displays user metadata, theme toggle switch, logout button (clears AsyncStorage) |
| **API Service** | `api.js` | Axios instance with `baseURL`, request interceptor for JWT `Authorization` header |
| **Theme Context** | `ThemeContext.js` | React Context provider exporting `theme` object and `toggleTheme` function |

### User Flows

```
┌──────────┐     ┌───────────┐     ┌────────────────┐
│  Login   │────►│ Dashboard │────►│ View Progress  │
│  Screen  │     │  Screen   │     │ (Per Category) │
└──────────┘     └─────┬─────┘     └────────────────┘
                       │
                       ▼
               ┌───────────────┐     ┌──────────────────┐
               │   Material    │────►│ Upload Certificate│
               │   Screen      │     │ (File Picker)     │
               └───────┬───────┘     └──────────────────┘
                       │
                       ▼
               ┌───────────────┐
               │  Submission   │
               │  History List │
               │ (Status+Notes)│
               └───────────────┘
```

1. **Authentication:** Student logs in → JWT is saved in AsyncStorage → Redirected to the Tab Navigator.
2. **Dashboard View:** App fetches the student's enrolled course rules and their submitted activities → Calculates approved hours vs required hours → Renders progress bars.
3. **Upload Certificate:** Student goes to the "Material" tab → Selects a category → Types claimed hours → Opens device file picker → Selects PDF/Image → Native `fetch` uploads the file as `multipart/form-data` to the backend.
4. **Feedback Loop:** Student checks submission history → Sees "Rejected" status → Reads coordinator feedback → Re-uploads corrected certificate.

### Design Tokens & Theming

The app supports Light and Dark modes via a centralized `ThemeContext`. All screens consume theme tokens for consistent visual identity:

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `background` | `#FFFFFF` | `#121212` | Screen background |
| `card` | `#F5F5F5` | `#1E1E1E` | Card and container surfaces |
| `text` | `#333333` | `#E0E0E0` | Primary text content |
| `primary` | `#007AFF` | `#0A84FF` | Buttons, links, progress bars |
| `border` | `#E0E0E0` | `#333333` | Dividers and input borders |

---

## 🛠 Technology Stack

| Technology | Purpose |
|---|---|
| **React Native (0.81)** | Core framework for cross-platform mobile development |
| **Expo (SDK 54)** | Toolchain, native module access, and build environment |
| **React Navigation 7** | Stack and Bottom Tab routing |
| **Axios** | HTTP client for JSON API communication |
| **AsyncStorage** | Persistent local key-value storage for tokens |
| **Expo Document Picker** | Access to native device file systems |
| **Expo Status Bar** | Dynamic status bar styling (Light/Dark themes) |
| **Ionicons** | Vector icons for the tab bar and UI elements |

---

## 📂 Project Structure

```
login-app/
├── assets/                 # Local images (e.g., senac-logo.png)
├── src/
│   ├── context/
│   │   └── ThemeContext.js # Global Light/Dark theme provider
│   ├── screens/
│   │   ├── LoginScreen.js  # Authentication UI
│   │   ├── DashboardScreen.js # Progress and metrics UI
│   │   ├── MaterialScreen.js  # File upload and history UI
│   │   └── ProfileScreen.js   # User info and logout UI
│   ├── services/
│   │   └── api.js          # Axios configuration and JWT interceptor
├── App.js                  # Main entry point and Navigation setup
├── app.json                # Expo configuration manifest
└── package.json            # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Expo CLI** (installed globally or run via npx)
- **Expo Go** app installed on your physical iOS/Android device, OR
- **Android Studio / Xcode** for running on an emulator/simulator.

### Installation

```bash
# Clone the repository
git clone https://github.com/gabrielfranca42/REACT-NATIVE-SIGAC.git
cd REACT-NATIVE-SIGAC/login-app

# Install dependencies
npm install
```

### API Integration

By default, the app is configured to point to the production backend on Render.
If you are running the backend locally, you **must** update the IP address in `src/services/api.js` and `src/screens/MaterialScreen.js` (for the fetch call).

**Important for Local Testing:** 
You cannot use `localhost` on a physical device. You must use your computer's local IP address (e.g., `192.168.1.15`).

```javascript
// src/services/api.js
const api = axios.create({
  // Local development (replace with your IPv4):
  // baseURL: 'http://192.168.1.15:3000/api/v1',
  
  // Production URL:
  baseURL: 'https://projeto-senac-geraldo-1.onrender.com/api/v1',
  // ...
});
```

### Running the App

```bash
# Start the Expo Metro Bundler
npx expo start
```

1. **Physical Device:** Open the Expo Go app on your phone and scan the QR code displayed in the terminal.
2. **Android Emulator:** Press `a` in the terminal.
3. **iOS Simulator:** Press `i` in the terminal (Mac only).

---

## 📦 Related Repositories

| Project | Description |
|---|---|
| [PROJETO-SENAC-GERALDO](https://github.com/gabrielfranca42/PROJETO-SENAC-GERALDO) | Node.js Backend API (Core Business Logic) |
| [FRONTEND-REACT-PI](https://github.com/gabrielfranca42/FRONTEND-REACT-PI) | Web dashboard for coordinators and administrators |

---

## 📄 License

This project was developed as an academic integrative project (Projeto Integrador) at **SENAC Recife** for the Systems Analysis and Development program.
