# Installation Guide

## Quick Start

### 1. Install Dependencies

Run the setup script (easiest way):
```bash
./setup.sh
```

Or manually:
```bash
npm install
npm install @headlessui/react @heroicons/react
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3039`

### 3. Build for Production

```bash
npm run build
```

## What's Included

### ✅ Installed Packages

- **React 19.2.0** - Latest React with new features
- **TypeScript 5.9.3** - Type safety
- **Tailwind CSS 4.1.17** - Utility-first CSS
- **Vite** - Fast build tool
- **Headless UI** - Accessible components
- **Heroicons** - Beautiful icons

### ✅ Created Components

1. **Button** - Multi-variant button with loading states
2. **Input** - Form input with validation
3. **Card** - Content container
4. **Toast** - Notification system
5. **Sidebar** - Navigation menu
6. **Header** - Top bar with user menu

### ✅ Created Pages

1. **Options** - Complete API configuration page with:
   - API Key management (with show/hide)
   - API Endpoint configuration
   - Advanced settings (Max Tokens, Logging)
   - Form validation
   - Toast notifications
   - Test connection functionality

## Features

🎨 **Modern Design**
- WordPress-inspired admin interface
- Clean, professional styling
- Smooth animations and transitions

🔐 **API Key Management**
- Secure password field with toggle
- Form validation
- Test connection feature

⚡ **Performance**
- Fast HMR with Vite
- Optimized bundle size
- TypeScript for better DX

♿ **Accessibility**
- Keyboard navigation
- Focus indicators
- Screen reader support
- ARIA labels

📱 **Responsive**
- Works on all screen sizes
- Mobile-friendly sidebar
- Adaptive layouts

## Next Steps

1. Customize the API endpoints
2. Add your actual API integration
3. Extend with more pages (Dashboard, Analytics)
4. Add authentication
5. Connect to WordPress backend

## Troubleshooting

### Port Already in Use
Change the port in `vite.config.ts`:
```typescript
server: {
  port: 3040, // Change to any available port
  host: true,
}
```

### Missing Dependencies
If you see import errors, ensure all packages are installed:
```bash
npm install @headlessui/react @heroicons/react
```

### TypeScript Errors
Make sure your IDE is using the workspace TypeScript version:
```bash
npx tsc --version
```

## Development Tips

1. **Hot Reload**: Changes auto-reload in browser
2. **Type Safety**: TypeScript catches errors early
3. **Tailwind**: Use utility classes for styling
4. **Components**: Import from `./components` for cleaner code

## Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Toast.tsx
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── index.ts   # Export all components
├── pages/          # Page components
│   └── Options.tsx
├── App.tsx         # Main app with layout
├── main.tsx        # Entry point
└── index.css       # Global styles
```

Enjoy building! 🚀

