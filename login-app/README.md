# ValidaUP — Student Mobile App (SIGAC)

> The student-facing mobile application for the Integrated Complementary Activities Management System (SIGAC).

---

## 📖 Table of Contents

- [Project Purpose](#-project-purpose)
- [Key Features](#-key-features)
- [System Design](#-system-design)
  - [Architecture](#architecture)
  - [User Flows](#user-flows)
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

## 🎯 Project Purpose

**ValidaUP** is the mobile application component of the SIGAC ecosystem, built specifically for **Students**. 

Gathering complementary activity hours (seminars, courses, internships) is a mandatory requirement for graduation. Historically, students struggled with printing certificates, delivering them to the coordinator's office, and blindly waiting for manual updates to know if they had enough hours to graduate.

ValidaUP solves this by putting the entire process in the student's pocket:
1. **Upload instantly:** Take a photo or select a PDF of a certificate and upload it securely.
2. **Track progress:** A visual dashboard shows exactly how many hours are approved, pending, and required per category.
3. **Stay informed:** View the history of all submissions, including feedback from coordinators if a certificate is rejected.

---

## ✨ Key Features

- **Secure Login:** Authenticate using Student ID (Matrícula) or Email.
- **Visual Dashboard:** Progress bars showing completion percentage of total hours and specific category requirements.
- **Document Upload:** Native file picker to select PDF or JPEG certificates directly from the device storage or cloud drives.
- **Submission History:** A detailed list of all past uploads, displaying their current status (Pending, Approved, Rejected).
- **Feedback Viewing:** Read direct comments from the coordinator regarding rejected or adjusted submissions.
- **Theme Support:** Built-in Light and Dark modes managed via React Context.
- **Native PDF Handling:** External linking to view uploaded PDF certificates safely.

---

## 🏗 System Design

### Architecture

The application is built using **React Native** and managed by the **Expo framework**, ensuring a smooth development experience and seamless deployment to both iOS and Android platforms.

- **Navigation:** Handled by `@react-navigation`. The app uses a Stack Navigator for the authentication flow (Login -> Main) and a Bottom Tab Navigator for the core features (Dashboard, Upload, Profile).
- **State & Theme:** Global state (like the active Theme) is managed via React Context API (`ThemeContext.js`). User sessions and JWT tokens are persisted securely using `@react-native-async-storage/async-storage`.
- **API Communication:** Utilizes `axios` for standard JSON requests (like fetching dashboard data) and the native `fetch` API for `multipart/form-data` uploads, bypassing known React Native Axios limitations with file uploads.
- **File Selection:** Integrates `expo-document-picker` to interface with the native iOS Files app and Android Document Provider.

### User Flows

1. **Authentication:** Student logs in -> JWT is saved in AsyncStorage -> Redirected to the Tab Navigator.
2. **Dashboard View:** App fetches the student's enrolled course rules and their submitted activities -> Calculates approved hours vs required hours -> Renders progress bars.
3. **Upload Certificate:** Student goes to the "Material" tab -> Selects a category -> Types claimed hours -> Opens device file picker -> Selects PDF/Image -> Native `fetch` uploads the file as `multipart/form-data` to the backend.

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

This project was developed as an academic integrative project (Projeto Integrador) at **SENAC Recife**.
