# Portfolio (Year 3000 Vision)

![Design System](https://img.shields.io/badge/Design-Year_3000-7aa2f7)
![Stack](https://img.shields.io/badge/Stack-Next.js_16_|_React_19_|_GSAP-bb9af7)
![License](https://img.shields.io/badge/License-MIT-9ece6a)

> **"Consciousness-responsive interfaces that anticipate, breathe, and resonate."**

A high-performance, immersive software engineering portfolio built with Next.js 16 and React 19. This project demonstrates advanced frontend architecture, WebGL integration, and a custom "living" design system.

## 🚀 Features

-   **Next.js 16 (App Router)**: Utilizing the latest React Server Components architecture.
-   **Living Interface**: UI elements that "breathe" and react to cursor velocity and proximity.
-   **GSAP Animation Engine**: Complex, timeline-based entry and interaction animations.
-   **Hybrid Rendering**: Seamless blend of standard DOM and WebGL (Three.js) elements.
-   **Bento Grid Layout**: Fluid, responsive grid system with neighbor-aware physics.
-   **MDX Content Layer**: Type-safe blog and project portfolio management.

## 🛠️ Tech Stack

-   **Core**: Next.js 16.1, React 19.2, TypeScript 5
-   **Styling**: Tailwind CSS 4, CSS Modules
-   **Motion**: GSAP 3.14, @gsap/react, Lenis Scroll
-   **Graphics**: React Three Fiber, GLSL Shaders
-   **Testing**: Vitest, React Testing Library

## 🏁 Getting Started

### Prerequisites

-   Node.js 20+
-   npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/minipuft/portfolio.git

# Enter directory
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to view the application.

## 📖 Documentation

Detailed architectural documentation is available in the `docs/` directory:

-   [**Stack Overview**](docs/STACK_OVERVIEW.md): Deep dive into the "Year 3000" architecture and hooks.
-   [**Animation Standards**](docs/standards/ANIMATION_GSAP.md): Guidelines for the GSAP animation pipeline.

## 🧪 Testing

This project uses **Vitest** for unit and integration testing.

```bash
# Run tests
npm run test

# Run type check
npm run typecheck
```

## 📂 Project Structure

```bash
src/
├── app/               # Next.js App Router pages
├── components/        #
│   ├── effects/       # Visual effects (Shaders, Distortion)
│   ├── home/          # Homepage specific components (Bento)
│   └── ui/            # Shared primitives (ScrambleText, Buttons)
├── lib/               #
│   ├── animations/    # GSAP presets
│   ├── hooks/         # Physics & interaction hooks
│   └── shaders/       # GLSL shader code
└── content/           # MDX content (Blog, Projects)
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
