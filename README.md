# Syniq — Modern Memory Challenge

**Syniq** is a premium, minimal, Simon-inspired cognitive training laboratory built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**. It is fully installable as a Progressive Web App (PWA) with offline capabilities.

---

## Features

1. **Four Training Modes**:
   - **Classic**: Forward order replication.
   - **Reverse**: Memorize and enter in reverse order.
   - **Speed Rush**: Flash speeds up by 8% each round.
   - **Time Attack**: Race against a 45-second countdown with input time bonuses.
2. **IndexedDB Local Storage**: Scores, stats, and settings are saved completely locally using asynchronous database transactions.
3. **Sound Synthesizer**: Programmatic audio chime generation via browser Web Audio API oscillator nodes (no static file downloads required).
4. **Accessibility Built-in**: Keyboard navigation, screen-reader details, high contrast overrides, color-blind visual helpers, and OS reduced motion adaptations.

---

## Folder Structure

```
Syniq/
├── tests/                  # Vitest unit & integration test suites
├── public/                 # Favicon vector assets
├── src/
│   ├── app/                # Root App component and routing provider
│   ├── components/
│   │   ├── game/           # Gameplay UI (GameBoard, SimonButton, etc.)
│   │   ├── navigation/     # Header & Footer navbar layouts
│   │   ├── profile/        # Player profiles & score tables
│   │   └── ui/             # Reusable UI primitives (GlassCard, Modal, etc.)
│   ├── context/            # Settings and Toast global context providers
│   ├── core/               # GameEngine domain logical modules (independent of React)
│   ├── hooks/              # Custom React hooks (useGame, useSettings, etc.)
│   ├── layouts/            # Page layouts and initialization splash screens
│   ├── models/             # Domain object structures (Player, ScoreEntry, etc.)
│   ├── pages/              # Lazy loaded routing pages
│   ├── repositories/       # IndexedDB repository wrappers
│   ├── services/           # Telemetry, Audio, and Settings services
│   └── styles/             # Global theme and tailwind CSS sheets
```

---

## Tech Stack

- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: IndexedDB (Native browser storage)
- **Audio**: Web Audio API (Synthesizer)
- **Testing**: Vitest, React Testing Library, jsdom
- **PWA**: vite-plugin-pwa (Auto service worker and manifest injection)

---

## Installation & Setup

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Run in Development Mode**:

   ```bash
   npm run dev
   ```

3. **Run Test Suites**:

   ```bash
   npm run test
   ```

4. **Compile Production Bundle**:

   ```bash
   npm run build
   ```

5. **Preview Bundle**:
   ```bash
   npm run preview
   ```

---

## License

This project is licensed under the MIT License. See [LICENSE](file:///d:/Syniq/LICENSE) for details.
