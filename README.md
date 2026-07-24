<div align="center">

  <img src="./public/favicon.svg" alt="SYNIQ Logo" width="130" height="130" />

  # SYNIQ — Modern Memory Challenge

  **Enterprise Cognitive Training Platform & 3D Memory Arena**

  <p align="center">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=800&size=20&pause=1400&color=38BDF8&center=true&vCenter=true&width=900&lines=SYNIQ+3D+Memory+Challenge;React+19+%E2%80%A2+TypeScript+%E2%80%A2+Vite+%E2%80%A2+IndexedDB;Clean+SOLID+OOP+Architecture+%E2%80%A2+Zero-Warning+Quality" alt="Typing animation" />
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/BUILD-PASSING-10B981?style=for-the-badge&labelColor=0D1117" alt="Build Passing" />
    <img src="https://img.shields.io/badge/TESTS-14%2F14_PASSED-0EA5E9?style=for-the-badge&labelColor=0D1117" alt="Tests Passed" />
    <img src="https://img.shields.io/badge/TS_STRICT-6.0-3178C6?style=for-the-badge&labelColor=0D1117" alt="TypeScript Strict" />
    <img src="https://img.shields.io/badge/LINT-ZERO_WARNINGS-7C3AED?style=for-the-badge&labelColor=0D1117" alt="Lint Zero Warnings" />
  </p>

  <p align="center">
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Tech_Stack-10B981?style=for-the-badge&labelColor=0D1117" alt="Tech Stack" /></a>
    <a href="#-core-features"><img src="https://img.shields.io/badge/Core_Features-0EA5E9?style=for-the-badge&labelColor=0D1117" alt="Core Features" /></a>
    <a href="#-game-modes"><img src="https://img.shields.io/badge/Game_Modes-7C3AED?style=for-the-badge&labelColor=0D1117" alt="Game Modes" /></a>
    <a href="#-architecture--oop-design"><img src="https://img.shields.io/badge/Architecture-F97316?style=for-the-badge&labelColor=0D1117" alt="Architecture" /></a>
    <a href="#-getting-started"><img src="https://img.shields.io/badge/Getting_Started-EF4444?style=for-the-badge&labelColor=0D1117" alt="Getting Started" /></a>
  </p>

  <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3987-4801-a50e-c67081e2b58b.gif" width="100%" alt="Header Divider Animation" />

</div>

---

## 🛠️ Tech Stack

<a id="tech-stack"></a>

### Core & Frontend

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,ts,vite,tailwind,html,css,figma" alt="Core engineering icons" />
  <br><br>
  <img src="https://img.shields.io/badge/React_19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black&labelColor=0D1117" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript_6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=0D1117" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite_8.1-646CFF?style=for-the-badge&logo=vite&logoColor=white&labelColor=0D1117" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_4.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=0D1117" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white&labelColor=0D1117" alt="Framer Motion" />
</p>

### Storage, Audio & Offline Engine

<p align="center">
  <img src="https://img.shields.io/badge/IndexedDB_Async-0D1117?style=for-the-badge&labelColor=0D1117&color=F97316" alt="IndexedDB" />
  <img src="https://img.shields.io/badge/Web_Audio_Synthesizer-0D1117?style=for-the-badge&labelColor=0D1117&color=10B981" alt="Web Audio API" />
  <img src="https://img.shields.io/badge/PWA_Offline_Engine-0D1117?style=for-the-badge&labelColor=0D1117&color=7C3AED" alt="PWA" />
  <img src="https://img.shields.io/badge/Domain_Driven_OOP-0D1117?style=for-the-badge&labelColor=0D1117&color=38BDF8" alt="OOP Engine" />
</p>

### Quality Assurance & Tooling

<p align="center">
  <img src="https://skillicons.dev/icons?i=vitest,vscode,git,github" alt="Tooling icons" />
  <br><br>
  <img src="https://img.shields.io/badge/Vitest_Unit_Suite-6E9F18?style=for-the-badge&logo=vitest&logoColor=white&labelColor=0D1117" alt="Vitest" />
  <img src="https://img.shields.io/badge/ESLint_Strict-4B32C3?style=for-the-badge&logo=eslint&logoColor=white&labelColor=0D1117" alt="ESLint" />
  <img src="https://img.shields.io/badge/MIT_License-0D1117?style=for-the-badge&labelColor=0D1117&color=EAB308" alt="MIT License" />
</p>

---

## 📦 Overview

**SYNIQ** (Simon Nexus) is an enterprise-grade, high-performance cognitive memory training application built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Framer Motion**.

Featuring a **3D Wood & Gemstone Gaming Aesthetic**, Web Audio API sound synthesis, native browser IndexedDB persistent storage, and strict SOLID / Domain-Driven OOP design, SYNIQ delivers an immersive, responsive, and tactile cognitive challenge across mobile and desktop.

---

## 🎯 Core Features

<a id="core-features"></a>

- 🎮 **4 Distinct Training Modes**: Challenge forward recall, reverse sequence processing, accelerating speeds, and time-attack countdowns.
- 🔊 **Web Audio Synthesizer**: Programmatic audio chime synthesis built with browser `AudioContext` and `OscillatorNode` instances (0 static audio file downloads required).
- 💾 **IndexedDB Async Storage**: High-performance local database transactions for player profiles, top 10 leaderboard deduplication, and game configurations.
- 👁️ **Accessibility & Tactile Feedback**:
  - Haptic vibration feedback for mobile devices.
  - High Contrast mode and Color-Blind symbol overlays (Protanopia, Deuteranopia, Tritanopia).
  - Full keyboard control (`1`, `2`, `3`, `4` and `Arrow` keys) and screen reader support.
- ⚡ **Offline Progressive Web App (PWA)**: Service worker precaching and manifest injection for standalone offline installation.

---

## 🕹️ Game Modes

<a id="game-modes"></a>

| Mode | Badge | Description |
| :--- | :---: | :--- |
| **Classic** | 🧠 | Replicate the generated memory sequence step-by-step in forward order. |
| **Reverse** | 🔄 | Memorize the sequence and input items in **exact reverse order**. |
| **Speed Rush** | ⚡ | Flash duration speeds up by **8% each round** (clamping at 2.5x max speed). |
| **Time Attack** | ⏱️ | Race against a 45-second countdown timer. Earn **+1 sec** per step and **+5 sec** per round clear. |

---

## 🏛️ Architecture & OOP Design

<a id="architecture--oop-design"></a>

SYNIQ is built on a **Decoupled Domain Engine Architecture**, keeping core game rules completely independent of the React UI rendering layer.

```
src/
├── app/                  # Application Bootstrap & Route Providers
├── assets/               # Statics & Background Image Assets
├── components/           # Modular UI & Feature Components
│   ├── auth/             # Nickname & Profile Setup Modals
│   ├── avatar/           # Avatar Datasets & AvatarDisplay Component
│   ├── game/             # Simon GameBoard, ControlPanel, Score & Status Panels
│   ├── navigation/       # Navbar, Footer, Logo
│   ├── profile/          # PlayerProfileCard, TopTenTable
│   └── ui/               # Reusable Atomic UI Primitives (Modal, Toast, Loader, etc.)
├── context/              # Context Providers (SettingsContext, ThemeContext)
├── core/                 # Pure OOP Domain Logic (GameEngine, ScoreCalculator, SequenceManager)
├── hooks/                # Custom React Hooks (useGame, useSettings, useDocumentTitle)
├── layouts/              # App Shell Layout (AppLayout)
├── models/               # Data Schemas (Player, ScoreEntry, Round)
├── pages/                # Lazy-Loaded Route Views
├── repositories/         # IndexedDB Repositories (PlayerRepository, LeaderboardRepository)
├── routes/               # Navigation & App Router Configuration
├── services/             # Domain Services (AudioService, LeaderboardService, StorageService)
├── styles/               # Global CSS & Tailwind Design System
└── utils/                # Utility Functions (cn helper)
```

### SOLID Compliance & Design Patterns
- **Dependency Injection (DI)**: `GameEngine` receives `SequenceManager`, `InputValidator`, `ScoreCalculator`, and `RandomGenerator` via constructor injection.
- **Repository Pattern**: Data persistence uses `IRepository<T, K>` abstractions over IndexedDB object stores.
- **Observer Pattern**: `GameEngine.subscribe(listener)` notifies UI components of state transitions reactively.
- **Strategy & Factory Pattern**: Extensible `SoundTheme` synthesizer and scoring options.

---

## ⚙️ Getting Started

<a id="getting-started"></a>

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Steps

1. **Clone Repository**:
   ```bash
   git clone https://github.com/Moparapairayat/Syniq.git
   cd Syniq
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Compile Production Bundle**:
   ```bash
   npm run build
   ```

---

## 🧪 Quality & Verification

SYNIQ maintains a zero-warning, zero-error code quality guarantee.

```bash
# Run Vitest Unit Test Suite
npm test

# Run ESLint Check
npm run lint

# Type Check & Build Production Bundle
npm run build
```

| Test Suite | Status | Coverage |
| :--- | :---: | :--- |
| `tests/unit/GameEngine.test.ts` | ✅ PASS | Core state transitions, sequence generation, reverse recall validation. |
| `tests/unit/Leaderboard.test.ts` | ✅ PASS | Top 10 deduplication, high score sorting, duplicate purging. |
| `tests/unit/Settings.test.ts` | ✅ PASS | Default settings load, partial updates, factory resets. |

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

<div align="center">

  <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3987-4801-a50e-c67081e2b58b.gif" width="100%" alt="Footer Divider Animation" />

  <sub>Built with care for cognitive training & visual memory precision.</sub>

</div>
