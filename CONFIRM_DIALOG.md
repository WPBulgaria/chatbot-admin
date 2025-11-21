# ConfirmDialog Component

A reusable confirmation dialog component for destructive or important actions.

## Features

- ✅ **Headless UI Dialog** - Fully accessible
- ✅ **Two variants** - Danger (red) and Primary (blue)
- ✅ **Loading states** - Shows spinner and disables buttons
- ✅ **Smooth animations** - Fade and scale transitions
- ✅ **Icon badges** - Warning icon for danger, info icon for primary
- ✅ **Backdrop blur** - Modern glassmorphism effect
- ✅ **Keyboard support** - ESC to close, Tab navigation

## Props

```typescript
interface ConfirmDialogProps {
  isOpen: boolean;           // Show/hide the dialog
  onClose: () => void;       // Called when user cancels
  onConfirm: () => void;     // Called when user confirms
  title: string;             // Dialog title
  message: string;           // Confirmation message
  confirmText?: string;      // Confirm button text (default: 'Confirm')
  cancelText?: string;       // Cancel button text (default: 'Cancel')
  variant?: 'danger' | 'primary';  // Visual style (default: 'danger')
  loading?: boolean;         // Show loading state (default: false)
}
```

## Usage Example

### Basic Usage

```typescript
import { useState } from 'react';
import { ConfirmDialog } from './components';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    // Perform delete operation
    console.log('Item deleted');
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Delete Item
      </button>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
      />
    </>
  );
}
```

### With Loading State

```typescript
const [isOpen, setIsOpen] = useState(false);
const [loading, setLoading] = useState(false);

const handleConfirm = async () => {
  setLoading(true);
  await deleteItemAPI();
  setLoading(false);
  setIsOpen(false);
};

<ConfirmDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleConfirm}
  title="Delete Plan"
  message="Are you sure you want to delete this plan?"
  confirmText="Delete"
  cancelText="Cancel"
  variant="danger"
  loading={loading}
/>
```

### Primary Variant

```typescript
<ConfirmDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleConfirm}
  title="Confirm Action"
  message="Do you want to proceed with this action?"
  confirmText="Proceed"
  cancelText="Go Back"
  variant="primary"
/>
```

## Visual Appearance

### Danger Variant (Red)
- Red circular badge with warning icon
- Red confirm button
- Used for destructive actions (delete, remove, etc.)

### Primary Variant (Blue)
- Blue circular badge with info icon
- Blue confirm button
- Used for important confirmations

## Implementation Details

### State Management Pattern

The component uses a common pattern for managing confirmation dialogs:

1. **Track dialog state** - `isOpen` boolean
2. **Store item reference** - Keep track of what to delete/confirm
3. **Handle confirm** - Perform action and close dialog
4. **Handle cancel** - Just close dialog, no action

Example from Plans page:

```typescript
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
const [planToDelete, setPlanToDelete] = useState<string | null>(null);

const handleDeleteClick = (id: string) => {
  setPlanToDelete(id);
  setIsDeleteDialogOpen(true);
};

const handleDeleteConfirm = async () => {
  // Perform deletion using planToDelete
  setIsDeleteDialogOpen(false);
  setPlanToDelete(null);
};

const handleDeleteCancel = () => {
  setIsDeleteDialogOpen(false);
  setPlanToDelete(null);
};
```

## Accessibility

- **Keyboard navigation** - Tab through buttons, ESC to close
- **Focus management** - Auto-focuses dialog on open
- **ARIA labels** - Proper dialog title and description
- **Screen reader support** - Announces dialog content

## Styling

- **Backdrop** - Semi-transparent black with blur
- **Dialog** - White rounded card with shadow
- **Icon badge** - 48px circular badge with icon
- **Buttons** - Full Button component with variants
- **Animations** - 300ms ease-out for enter, 200ms ease-in for leave

## Best Practices

1. **Use descriptive titles** - Clear action being confirmed
2. **Explain consequences** - Mention if action is irreversible
3. **Loading states** - Always show loading for async operations
4. **Appropriate variant** - Use danger for destructive actions
5. **Clear button text** - "Delete" is better than "Yes"

## When to Use

✅ **Good use cases:**
- Deleting items
- Permanent actions
- Data loss warnings
- Critical confirmations

❌ **Not recommended for:**
- Simple yes/no questions (use simpler UI)
- Non-destructive actions (unless critical)
- Frequently repeated actions

## Reusability

This component is designed to be reusable across your entire application. You can use it for:

- Deleting plans, users, items
- Confirming purchases
- Leaving unsaved forms
- Resetting data
- Any destructive or important action

Simply import and configure with different props for each use case!

