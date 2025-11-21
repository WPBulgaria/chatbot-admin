# Quick Start Guide

## 🚀 Running the App

```bash
# Install dependencies (if not already done)
npm install @headlessui/react @heroicons/react

# Start development server
npm run dev
```

Open `http://localhost:3039` in your browser.

## 📱 Current Features

### 1. Plans Page (Default)
- **View all subscription plans** in a table
- **Add new plans** with a modal form
- **Edit existing plans** with pre-filled form
- **Delete plans** with confirmation
- **Unlimited options** using `-1` for chats/questions

**Plan Fields:**
- Plan Name
- Number of Chats
- Number of Questions
- Question Size (words)
- History Items Limit

### 2. Options Page
- **API Key management** with show/hide toggle
- **API Endpoint** configuration
- **Advanced settings** (Max Tokens, Logging)
- **Test Connection** feature
- **Form validation**

### 3. Navigation
- Top navigation bar with menu links
- Clean, horizontal layout
- Smooth page transitions

## 🎨 Available Components

All components are in `src/components/`:

- **Button** - With variants: primary, secondary, danger
- **Input** - With validation and helper text
- **Card** - Content container
- **Modal** - Dialog with Headless UI
- **ConfirmDialog** - Confirmation dialog for destructive actions
- **Toast** - Auto-dismiss notifications
- **Header** - Top navigation bar

## 📦 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── ConfirmDialog.tsx
│   ├── Toast.tsx
│   ├── Header.tsx
│   └── index.ts
├── pages/           # Page components
│   ├── Plans.tsx
│   └── Options.tsx
├── types/           # TypeScript types
│   └── plan.ts
├── App.tsx          # Main layout
├── main.tsx         # Entry point
└── index.css        # Tailwind directives
```

## 🎯 Key Files

- **`src/pages/Plans.tsx`** - Plans management page
- **`src/types/plan.ts`** - Plan data types
- **`src/components/Modal.tsx`** - Modal dialog component
- **`src/App.tsx`** - Main app with routing logic

## 💡 Tips

1. **Add New Pages**: 
   - Create in `src/pages/`
   - Add menu item to `src/components/Sidebar.tsx`
   - Add route case in `src/App.tsx`

2. **Styling**: 
   - Use Tailwind CSS classes
   - Follow existing component patterns
   - Use Headless UI for interactive components

3. **State Management**:
   - Currently using local state
   - Easy to upgrade to Context or Redux later

4. **Form Validation**:
   - Check `Plans.tsx` or `Options.tsx` for examples
   - Validate before submission
   - Show errors with Input component

## 🔧 Common Tasks

### Adding a New Menu Item

1. Edit `src/components/Header.tsx`:
```typescript
const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'newpage', label: 'New Page' },
  // ... other items
];
```

2. Edit `src/App.tsx`:
```typescript
case 'newpage':
  return <NewPage />;
```

### Creating a New Page

1. Create `src/pages/NewPage.tsx`
2. Import components from `../components`
3. Follow existing page structure

### Adding Form Validation

```typescript
const validateForm = (): boolean => {
  const newErrors = {};
  if (!field) newErrors.field = 'Error message';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## 📚 Documentation

- **COMPONENTS.md** - Component API reference
- **PLANS_FEATURE.md** - Plans feature details
- **INSTALLATION.md** - Setup instructions

## 🎉 You're Ready!

The app is fully functional and ready for development. Start by exploring the Plans page, then customize to your needs!

