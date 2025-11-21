# WP Chatbot Admin

A modern React application built with TypeScript and Tailwind CSS.

## Tech Stack

- **React** 19.2.0 - Modern UI library
- **TypeScript** 5.9.3 - Type-safe JavaScript
- **TanStack Router** - Type-safe file-based routing
- **Tailwind CSS** 4.1.17 - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Headless UI** - Accessible UI components

## Getting Started

### Install Dependencies

First, install all required dependencies:

```bash
npm install
npm install @headlessui/react @heroicons/react
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
wp-chatbot-admin/
├── src/
│   ├── routes/          # TanStack Router routes
│   │   ├── __root.tsx   # Root layout
│   │   ├── index.tsx    # Home route
│   │   ├── dashboard.tsx
│   │   ├── plans.tsx
│   │   ├── options.tsx
│   │   └── analytics.tsx
│   ├── components/      # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── Toast.tsx
│   │   ├── Header.tsx
│   │   └── index.ts
│   ├── pages/           # Page components
│   │   ├── Options.tsx  # API configuration page
│   │   └── Plans.tsx    # Plans management page
│   ├── types/           # TypeScript type definitions
│   │   └── plan.ts
│   ├── routeTree.gen.ts # Auto-generated route tree
│   ├── App.tsx          # Router provider
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles with Tailwind directives
├── index.html           # HTML entry point
├── vite.config.ts       # Vite + Router configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies and scripts
```

## Features

- ⚡️ Lightning fast development with Vite
- 🎨 Beautiful UI with Tailwind CSS
- 📘 Type-safe with TypeScript
- 🔥 Hot Module Replacement (HMR)
- 🎯 Modern React 19 with hooks
- 🛣️ TanStack Router with file-based routing
- 🎨 Headless UI components for accessible UI
- 📊 WordPress-style admin dashboard
- 🔐 API key management with validation
- 🎭 Modern toast notifications
- 📱 Fully responsive design
- 🔗 Deep linking and browser history support

## License

Apache-2.0

