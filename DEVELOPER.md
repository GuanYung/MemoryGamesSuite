# 🛠 Developer Guide: Memory Games Suite

Welcome to the **Memory Games Suite** development repository! This project is designed with a **"High Performance, Zero Framework Bloat"** philosophy.  
The core game engine is written in **Vanilla JavaScript (ESM)**, with **Vite** as the build orchestrator and **FastAPI** for global leaderboards.

---

## 🏗 Project Architecture

```text
MemoryGamesSuite/
├── backend/          # Python 3.11+ FastAPI backend (Leaderboards)
├── src/
│   ├── api/          # Fetch clients for backend integration
│   ├── components/   # Shared UI components (Navbar, HUD, Modals)
│   ├── games/        # Core Game Logic (Vanilla JS Modules)
│   ├── pages/        # Dashboard, Journey, and Top-level views
│   ├── styles/       # Fluid-design system (CSS Custom Properties)
│   ├── utils/        # Shared logic (Confetti, Shuffle, Helpers)
│   ├── main.js       # App Entry point & Router Init
│   └── router.js     # Hash-based SPA Router
├── public/           # Static assets (3D card assets, icons)
├── package.json      # Vite 8 & Vitest 4 configuration
└── uvicorn_start.py  # Optional backend helper script
```

## 🚀 Local Environment Setup

### 1. Prerequisites

- **Node.js 18.x or 20+** (Required for Vite 8 and Vitest 4)
- **Python 3.11+** (Required for the FastAPI backend)
- **Git** (For version control)

### 2. Frontend Setup

```bash
# Clone the repository
git clone https://github.com/GuanYung/MemoryGamesSuite.git
cd MemoryGamesSuite

# Install dev dependencies
npm install

# Start the Vite development server
npm run dev
# The app will be available at http://localhost:5173/
```

### 3. Backend Setup (Leaderboard API)

The backend uses SQLite by default for development. It stores its database in `leaderboard.db`.

```bash
# Navigate to backend directory (optional, but good for context)
# Or run from the root:
pip install -r backend/requirements.txt

# Start the FastAPI server using uvicorn
# Make sure you are in the project root
python3 -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
# Verify it's working by checking http://127.0.0.1:8000/health
```

---

## 🧪 Testing

We use **Vitest** for our unit tests. All test files are matching the `*.test.js` pattern.

```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run coverage
```

---

## 🛠 Contribution Guidelines

### 🎨 Design Standards
We adhere to the **"Premium HUD"** design language:
- **Colors**: Use the CSS variables defined in `src/styles/global.css`.
- **Animations**: Use the `animate-fade-in-up` class or custom `cubic-bezier` transitions.
- **Micro-animations**: Ensure every interaction (hover, click, match) has visual feedback.
- **Glassmorphism**: Use the `--color-bg-glass` token for UI panels.

### 🕹 Adding a New Game Module
To add a new game (e.g., "Matrix Recall"):
1. Create a new folder: `src/games/matrix-recall/`.
2. Implement an `index.js` exporting an `init(container)` function or an object with an `init` method.
3. Define game configurations in `config.js`.
4. Register the new route in `src/main.js`.
5. Add the game card metadata to `src/pages/home.js`.

### 🛡️ Backend Changes
If you modify the leaderboard schemas:
1. Update `backend/models.py` (SQLAlchemy).
2. Update `backend/schemas.py` (Pydantic).
3. Ensure you migrate the local `leaderboard.db` if necessary.

---

## 📦 Building for Production

```bash
# Build the production assets
npm run build

# Preview the built version locally
npm run preview
```

---

## 🆘 Troubleshooting

- **"Unexpected token import"**: Ensure you are using **Node 18+**. Older versions do not support modern ESM or the latest Vite/Vitest features.
- **"Address already in use (Port 8000)"**: You likely have an existing uvicorn instance running. Stop it or change the port in `src/api/client.js` and restart the backend.
- **CORS Errors**: The backend allows `*` by default for development. If you encounter errors, check the `CORSMiddleware` in `backend/main.py`.

---

**Happy Coding, Commander!** 🦾
