# Component Documentation

## Overview

A modern, WordPress-style admin dashboard built with React, TypeScript, Tailwind CSS, and Headless UI.

## Components

### 🎨 UI Components

#### Button (`src/components/Button.tsx`)
A versatile button component with multiple variants and states.

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean - shows loading spinner

**Features:**
- Loading state with spinner animation
- Disabled state
- Focus ring for accessibility
- Smooth transitions

#### Input (`src/components/Input.tsx`)
Form input component with validation and helper text.

**Props:**
- `label`: string - input label
- `error`: string - error message
- `helperText`: string - helper text below input

**Features:**
- Built-in error display
- Helper text support
- Focus states with ring
- Fully accessible

#### Card (`src/components/Card.tsx`)
Container component for content sections.

**Props:**
- `title`: string - card title
- `description`: string - card description
- `children`: ReactNode - card content

**Features:**
- Optional header with title/description
- Subtle shadow and border
- Consistent padding

#### Toast (`src/components/Toast.tsx`)
Notification component with auto-dismiss.

**Props:**
- `show`: boolean - visibility state
- `message`: string - notification message
- `type`: 'success' | 'error' | 'info'
- `onClose`: function - close handler

**Features:**
- Auto-dismiss after 3 seconds
- Smooth animations with Headless UI Transition
- Icon based on type
- Positioned in top-right corner

#### ConfirmDialog (`src/components/ConfirmDialog.tsx`)
Confirmation dialog for destructive actions.

**Props:**
- `isOpen`: boolean - visibility state
- `onClose`: function - cancel handler
- `onConfirm`: function - confirm handler
- `title`: string - dialog title
- `message`: string - confirmation message
- `confirmText`: string - confirm button text (default: 'Confirm')
- `cancelText`: string - cancel button text (default: 'Cancel')
- `variant`: 'danger' | 'primary' - visual style
- `loading`: boolean - loading state

**Features:**
- Icon badge based on variant (warning for danger, info for primary)
- Loading state with disabled buttons
- Smooth animations with Headless UI Dialog
- Backdrop blur effect
- Accessible keyboard navigation

#### Header (`src/components/Header.tsx`)
Top navigation header with menu links.

**Props:**
- `activeItem`: string - current active menu item
- `onItemClick`: function - menu item click handler

**Features:**
- Brand logo and title
- Horizontal navigation menu
- Active state highlighting
- Hover effects
- Clean, minimal design

### 📄 Pages

#### Options Page (`src/pages/Options.tsx`)
Main API configuration page with form validation.

**Features:**
- API Key input with show/hide toggle
- API Endpoint URL input
- Max Tokens number input
- Enable Logs toggle (Headless UI Switch)
- Form validation with error messages
- Test Connection button
- Save Changes button with loading state
- Reset to Defaults button
- Toast notifications for actions

**Form Fields:**
1. **API Key** - Password field with visibility toggle
2. **API Endpoint** - URL field with validation
3. **Max Tokens** - Number field with validation
4. **Enable Logs** - Toggle switch

**Actions:**
- Test Connection - Validates and tests API connection
- Save Changes - Saves settings with validation
- Reset to Defaults - Resets all fields

## Layout Structure

```
┌─────────────────────────────────────────────────┐
│  WP Chatbot Admin  [Dashboard] [Plans] [Options] [Analytics]│
├─────────────────────────────────────────────────┤
│                                                  │
│              Main Content Area                   │
│              (Centered, max-width)               │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Styling

All components use:
- **Tailwind CSS** for utility-first styling
- **Headless UI** for accessible, unstyled components (Dialog, Menu, Switch, Transition)
- **Custom transitions** for smooth interactions
- **WordPress-inspired** color scheme and spacing

## Color Palette

- Primary: Blue (600-700)
- Success: Green (500-600)
- Error: Red (500-600)
- Secondary: Gray (200-800)
- Background: Gray (50)

## Accessibility

All components follow best practices:
- Semantic HTML
- Keyboard navigation
- Focus indicators
- ARIA labels where needed
- Screen reader support via Headless UI

## Usage Example

```tsx
import { Button, Input, Card, Toast } from './components';
import { Options } from './pages/Options';

function App() {
  return (
    <div className="p-8">
      <Card title="My Card">
        <Input label="Email" type="email" />
        <Button variant="primary">Submit</Button>
      </Card>
    </div>
  );
}
```

