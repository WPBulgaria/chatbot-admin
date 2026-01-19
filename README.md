# WordPress Assistant Admin

A modern React-based admin interface for managing an AI-powered WordPress chatbot. Built with React 19, TypeScript, TanStack Router, and Tailwind CSS.

## Features

- **Dashboard** - Overview of chatbot activity and statistics
- **Chat Management** - View and manage user conversations with markdown support
- **Plans** - Configure subscription plans with usage limits
- **Knowledge Base** - Upload and manage files for AI context (PDF, JSON, CSV, XML, TXT)
- **Theme Customization** - Full visual customization of the chat widget
- **Settings** - API configuration, system instructions, and global limits

## Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **TanStack Router** - File-based routing with type safety
- **Tailwind CSS 4** - Utility-first styling
- **Headless UI** - Accessible UI components
- **Vite** - Fast build tool and dev server
- **Zod** - Runtime validation

## Prerequisites

- Node.js 18+
- npm or yarn
- WordPress installation with the WPB Chatbot plugin

## Installation

```bash
# Clone the repository
git clone https://github.com/WPBulgaria/chatbot-admin.git
cd chatbot-admin

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate PHP template only
npm run template
```

## Project Structure

```
src/
├── api/                    # API service classes
│   ├── base-api.tsx       # Base API with WordPress nonce auth
│   ├── chats-api.tsx      # Chat management endpoints
│   ├── configs-api.tsx    # Configuration endpoints
│   ├── files-api.tsx      # File upload/management
│   └── plans-api.tsx      # Subscription plans
├── components/             # Reusable UI components
│   ├── Button.tsx         # WordPress-styled button
│   ├── Card.tsx           # Content card container
│   ├── ConfirmDialog.tsx  # Confirmation modal
│   ├── Header.tsx         # Navigation header
│   ├── Input.tsx          # Form input
│   ├── Modal.tsx          # Modal dialog
│   ├── Pagination.tsx     # Table pagination
│   └── Toast.tsx          # Notification toast
├── pages/                  # Page components
│   ├── Chats.tsx          # Chat list page
│   ├── EditChat.tsx       # Single chat view
│   ├── KnowledgeBase.tsx  # File management
│   ├── Options.tsx        # Settings page
│   ├── Plans.tsx          # Plan management
│   └── Theme.tsx          # Theme customization
├── routes/                 # TanStack Router routes
├── types/                  # TypeScript definitions
│   ├── chat-theme.ts      # Theme configuration types
│   ├── configs.ts         # App configuration types
│   ├── knowledge-base.ts  # File types
│   └── plan.ts            # Plan types
└── utils/                  # Utility functions
    ├── errors.ts          # Error handling
    └── time.ts            # Date formatting
```

## WordPress Integration

The admin panel integrates with WordPress through:

1. **REST API** - All data operations use WordPress REST endpoints
2. **Nonce Authentication** - CSRF protection via `X-WP-Nonce` header
3. **PHP Template** - Build output generates WordPress-compatible template

### Configuration

The app expects a global `wpbChatbotConfig` object:

```javascript
window.wpbChatbotConfig = {
  root: "https://yoursite.com/wp-json/",
  nonce: "wp_rest_nonce_value"
};
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/wpb-chatbot/v1/configs` | GET/POST | App configuration |
| `/wpb-chatbot/v1/plans` | GET/POST/PUT/DELETE | Subscription plans |
| `/wpb-chatbot/v1/files` | GET/POST/DELETE | Knowledge base files |
| `/wpb-chatbot/v1/chats` | GET/POST/PUT/DELETE | Chat conversations |
| `/wpb-chatbot/v1/chats/{id}` | GET/PUT/DELETE | Single chat |
| `/wpb-chatbot/v1/chats/{id}/restore` | POST | Restore trashed chat |

## Theme Customization

The Theme page allows full customization of the chat widget:

- **Branding** - Name, logo, status indicator
- **Colors** - Primary, text, message bubbles, code blocks
- **Typography** - Font family and Google Fonts URL
- **Labels** - All UI text (i18n ready)
- **Backgrounds** - Page, header, input area, modals
- **Shadows** - Message bubbles, buttons, modals
- **Border Radius** - Messages, inputs, buttons, avatars

Theme settings are stored in the WordPress options table via the configs API.

## Building for Production

```bash
npm run build
```

This will:
1. Clean the `dist/` directory
2. Run TypeScript compilation
3. Build optimized assets with Vite
4. Generate `template.php` for WordPress integration

Output files are placed in `dist/` ready for deployment to your WordPress plugin.

## License

Apache-2.0 - See [LICENSE](LICENSE) for details.

## Author

**Sashe Vuchkov** - [WP Bulgaria](https://github.com/WPBulgaria)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- [Issue Tracker](https://github.com/WPBulgaria/chatbot-admin/issues)
- [Documentation](https://github.com/WPBulgaria/chatbot-admin#readme)
