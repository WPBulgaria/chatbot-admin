# Plans Feature Documentation

## Overview

The Plans feature allows administrators to manage chatbot subscription plans with detailed configuration options.

## Features

### 📋 Plans List View

A comprehensive table displaying all available plans with the following information:
- **Plan Name** - With a colored icon badge
- **Number of Chats** - Total chats allowed
- **Number of Questions** - Total questions allowed
- **Question Size** - Maximum words per question
- **History Limit** - Number of history items stored
- **Created Date** - When the plan was created
- **Actions** - Delete plan option

### ➕ Add Plan Functionality

A modal dialog with form validation that allows creating new plans with:

#### Form Fields:
1. **Plan Name** (text) - Required
   - Descriptive name for the plan (e.g., Basic, Pro, Enterprise)

2. **Number of Chats** (number) - Required
   - Total chats allowed in the plan
   - Use `-1` for unlimited

3. **Number of Questions** (number) - Required
   - Total questions allowed
   - Use `-1` for unlimited

4. **Question Size in Words** (number) - Required
   - Maximum words allowed per question
   - Must be a positive number

5. **History Items Limit** (number) - Required
   - Number of chat history items to store
   - Must be a positive number

### ✨ Additional Features

- **Edit Plans** - Modify existing plans with pre-filled form
- **Form Validation** - Real-time validation with error messages
- **Toast Notifications** - Success/error feedback for actions
- **Responsive Design** - Works on all screen sizes
- **Unlimited Plans** - Use `-1` for unlimited chats/questions
- **Delete Confirmation** - Confirmation dialog before deleting
- **Empty State** - Helpful message when no plans exist
- **Loading States** - Visual feedback during API calls
- **Dynamic Modal** - Same modal for both create and edit operations

## UI Components Used

- **Modal** (Headless UI Dialog) - For the add/edit plan form
- **ConfirmDialog** (Headless UI Dialog) - For delete confirmation
- **Card** - Container for the plans table
- **Input** - Form inputs with validation
- **Button** - Actions (Add, Edit, Delete, Submit, Cancel)
- **Toast** - Success/error notifications

## Data Structure

```typescript
interface Plan {
  id: string;
  name: string;
  numberOfChats: number;
  numberOfQuestions: number;
  questionSizeInWords: number;
  historyItemsLimit: number;
  createdAt: Date;
}
```

## Default Plans

The feature comes with 3 pre-configured sample plans:

1. **Basic Plan**
   - 100 chats
   - 1,000 questions
   - 50 words per question
   - 10 history items

2. **Pro Plan**
   - 500 chats
   - 5,000 questions
   - 100 words per question
   - 50 history items

3. **Enterprise Plan**
   - Unlimited chats
   - Unlimited questions
   - 200 words per question
   - 100 history items

## User Flow

### Adding a Plan
1. Navigate to "Plans" from sidebar
2. View all existing plans in table format
3. Click "Add Plan" button in top right
4. Fill out the form in the modal
5. Click "Add Plan" to create (with validation)
6. See success toast notification
7. New plan appears in the table

### Editing a Plan
1. Click the blue edit icon (pencil) next to any plan
2. Modal opens with form pre-filled with current values
3. Modify any fields as needed
4. Click "Update Plan" to save changes
5. See success toast notification
6. Plan updates in the table

### Deleting a Plan
1. Click the red delete icon (trash) next to any plan
2. Confirm deletion in the custom confirmation dialog
3. Dialog shows warning icon and confirmation message
4. Click "Delete" to confirm (with loading state)
5. Plan is removed from the table
6. See success toast notification

## Validation Rules

- **Plan Name**: Cannot be empty
- **Number of Chats**: Must be a valid number
- **Number of Questions**: Must be a valid number
- **Question Size**: Must be a positive number
- **History Limit**: Must be a positive number

## Styling

- WordPress-inspired design
- Blue gradient badges for plan names
- Hover effects on table rows
- Smooth animations for modal and toasts
- Responsive table with horizontal scroll on mobile
- Color-coded action buttons (red for delete)

## Future Enhancements

Potential additions for the Plans feature:
- ✅ ~~Edit existing plans~~ (Implemented!)
- Duplicate plans
- Search/filter plans
- Sort by columns
- Export plans to CSV
- Pricing information
- Active/Inactive status toggle
- Plan usage statistics
- Assign plans to users

