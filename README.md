# Family Feud

### Project Overview

Family Feud is a web-based implementation of the classic survey-style game show. Two teams compete to guess the most popular survey answers, earn points, and advance through rounds until a winning team is declared. This project focuses on real-time interaction, simple game state management, and an approachable UI for players and a host.

### Key Features

- Two-team match play with alternating turns
- Survey-based questions with revealed answers and point values
- Host-facing game board with round intros, buzzing, timers, and score plaques
- Buzzer and turn control for host and players
- Round progression and score tracking
- Responsive UI for desktop and mobile
- Local multiplayer with optional network play

### Tech Stack

- Frontend: React (or your preferred framework) for interactive UI
- Backend: Node.js + Express (optional WebSocket layer for real-time sync)
- Data: JSON or lightweight DB for question sets and scores
- Build tools: npm / yarn, webpack or Vite

### Running Locally

1. Clone the repository.
2. Install dependencies: `npm install`
3. Configure environment (if needed): copy `.env.example` to `.env` and adjust values.
4. Start both workspaces: `npm start` (runs Vite + Express together)
5. Front-end only: `npm run dev --prefix client`
6. Open the app in a browser at `http://localhost:5173` (Vite) or `http://localhost:3000` (proxy target).

### Game Board Preview

- Route: `/game-board`
- Round intro splash uses asset-specific overlays (`public/Round_One.png`, `Round_Two.png`, etc.).
- Press **Space** to buzz in; the input unlocks only for the active player during their timer window.
- Five-second answer timer, strikes, and steal flow all run client-side so latency is minimal.
- Placeholder round data lives inline in `client/src/pages/GameBoard.jsx` until the question bank JSON/API is wired in.

### Contributing

- Open issues for bugs or feature requests.
- Create feature branches and submit pull requests with clear descriptions.
- Keep changes focused and include tests or a short demo when applicable.

### Notes

- Question sets are customizable — add or edit JSON data files to change surveys.
- Consider adding authentication and persistent storage for extended multiplayer sessions.

### Current Sprint Snapshot (2025-11-12)
- Shared hamburger/drawer nav extracted and reused across landing + `/game-board`.
- Host game board now mirrors the TV layout: round intros, question zoom, face-off buzzing, timers, strikes, steals, scoring, and placeholder assets for cards/players.
- Board logic enforces eight-slot symmetry (rows render 1/5, 2/6, 3/7, 4/8) and keeps empty cards in the bottom rows for visual balance.
- Timers use client-side grace windows so spacebar buzzing and answer windows feel snappy offline; backend hooks will subscribe to the same events later.
- README and build log refreshed with the latest front-end expectations; backend integration TODOs remain for real data feeds.

### Dev Proxy
- Vite development server proxies `/api/*` and `/auth/*` to the Express backend on `http://localhost:3000` so sign‑in/sign‑up work locally with cookies.

### Placeholder Routes
- `/under-construction` indicates incomplete flows/actions.
- `/signed-out` confirms sign‑out.
- Unknown routes render a friendly 404 page.
