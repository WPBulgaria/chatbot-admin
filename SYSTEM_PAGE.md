# System Information Page

## Overview

The System page provides a comprehensive dashboard displaying server statistics, PHP configuration, WordPress setup, and system resources.

## Features

### 📊 Information Sections

#### 1. Server Information
- Operating System
- Server Software (Apache/Nginx)
- Hostname
- Server IP Address
- Server Time (live)
- System Uptime

#### 2. PHP Configuration
- PHP Version
- Memory Limit
- Max Execution Time
- Post Max Size
- Upload Max Filesize
- Max Input Vars
- Loaded PHP Extensions
- Opcache Status

#### 3. WordPress Setup
- WordPress Version
- Site URL
- Home URL
- WP Content Directory
- Active Theme
- Active Plugins Count
- Database Version
- Database Charset

#### 4. Database Information
- Database Server Type & Version
- Database Name
- Database Size
- Tables Count
- Max Connections
- Connection Charset

#### 5. System Resources
- Total Disk Space
- Used Disk Space (with percentage)
- Free Disk Space
- Total Memory (RAM)
- Used Memory (with percentage)
- Free Memory
- CPU Usage (percentage)
- Load Average

#### 6. Quick Actions
- **Refresh Stats** - Update system information
- **Export Report** - Download system report
- **Check Health** - Run health diagnostics

## UI Design

### Status Indicators

Each information item can have a status badge:

- **Success** (Green) - Everything is optimal
- **Warning** (Yellow) - Needs attention
- **Error** (Red) - Critical issue
- **None** - Informational only

### Layout

```
┌─────────────────────────────────────────────────────┐
│  System Information                                  │
│  Server stats, PHP configuration, and WordPress...  │
├──────────────────────┬──────────────────────────────┤
│  Server Information  │  PHP Configuration           │
│  🖥️ Icon + Details   │  </> Icon + Details          │
├──────────────────────┼──────────────────────────────┤
│  WordPress Setup     │  Database Information        │
│  🌐 Icon + Details   │  💾 Icon + Details           │
├──────────────────────┴──────────────────────────────┤
│  System Resources                                    │
│  📊 Icon + Details                                   │
├──────────────────────────────────────────────────────┤
│  Quick Actions (3 buttons)                          │
└──────────────────────────────────────────────────────┘
```

### Visual Elements

- **Icons**: Each section has a colored gradient icon badge
- **Hover Effects**: Info rows highlight on hover
- **Status Badges**: Colored badges with icons for status
- **Color Coding**: Values change color based on status
- **Responsive Grid**: 2-column on large screens, 1-column on mobile

## Data Structure

```typescript
interface SystemInfo {
  label: string;         // Display label
  value: string;         // Display value
  status?: 'success' | 'warning' | 'error';  // Optional status
}
```

## Sample Data

The page currently displays mock data for demonstration. In production, this should be connected to actual system APIs.

### Server Information
```typescript
{ label: 'Operating System', value: 'Linux Ubuntu 22.04 LTS', status: 'success' }
{ label: 'Server Software', value: 'Apache/2.4.52' }
{ label: 'Hostname', value: 'wp-chatbot-server.local' }
// ... more items
```

### PHP Configuration
```typescript
{ label: 'PHP Version', value: '8.2.10', status: 'success' }
{ label: 'Memory Limit', value: '256M', status: 'success' }
{ label: 'Opcache', value: 'Enabled', status: 'success' }
// ... more items
```

## Integration Points

### Future API Integration

Replace mock data with real system data:

```typescript
// Fetch from WordPress REST API
const fetchSystemInfo = async () => {
  const response = await fetch('/wp-json/chatbot/v1/system');
  return response.json();
};

// Or use WordPress AJAX
const getSystemInfo = () => {
  return wp.ajax.post('get_system_info', {
    _ajax_nonce: wpData.nonce,
  });
};
```

### WordPress Backend (PHP)

Create a REST API endpoint:

```php
add_action('rest_api_init', function () {
  register_rest_route('chatbot/v1', '/system', [
    'methods' => 'GET',
    'callback' => 'get_system_information',
    'permission_callback' => function () {
      return current_user_can('manage_options');
    }
  ]);
});

function get_system_information() {
  return [
    'server' => [
      'os' => PHP_OS,
      'software' => $_SERVER['SERVER_SOFTWARE'],
      'hostname' => gethostname(),
      'ip' => $_SERVER['SERVER_ADDR'],
      'time' => current_time('mysql'),
    ],
    'php' => [
      'version' => PHP_VERSION,
      'memory_limit' => ini_get('memory_limit'),
      'max_execution_time' => ini_get('max_execution_time'),
      // ... more PHP info
    ],
    'wordpress' => [
      'version' => get_bloginfo('version'),
      'site_url' => get_site_url(),
      'theme' => wp_get_theme()->get('Name'),
      'plugins' => count(get_plugins()),
    ],
    // ... more data
  ];
}
```

## Customization

### Adding New Information

1. Add to the appropriate info array:
```typescript
const serverInfo: SystemInfo[] = [
  // ... existing items
  { label: 'New Info', value: 'Value', status: 'success' },
];
```

2. The UI will automatically update!

### Changing Status Colors

Modify the `getStatusColor()` function:
```typescript
const getStatusColor = (status?: 'success' | 'warning' | 'error'): string => {
  switch (status) {
    case 'success': return 'text-green-600';
    case 'warning': return 'text-yellow-600';
    case 'error': return 'text-red-600';
    default: return 'text-gray-900';
  }
};
```

### Adding New Sections

Use the `renderInfoSection()` helper:
```typescript
{renderInfoSection(
  'My New Section',
  myInfoArray,
  <svg>...</svg>  // Icon
)}
```

## Accessibility

- ✅ Semantic HTML structure
- ✅ Color-coded with text labels (not just color)
- ✅ Keyboard navigable buttons
- ✅ Screen reader friendly
- ✅ Proper heading hierarchy
- ✅ Status indicators with icons and text

## Performance

- **Fast Rendering**: Static data renders instantly
- **No External Requests**: Mock data (no API calls yet)
- **Optimized Grid**: CSS Grid for efficient layout
- **Minimal Re-renders**: Pure functional components

## Use Cases

### For Administrators
- Quick system health check
- Verify PHP configuration
- Check WordPress version
- Monitor resource usage
- Troubleshoot issues

### For Developers
- Debug environment issues
- Verify server requirements
- Check PHP extensions
- Review WordPress setup

### For Support
- Gather system information
- Export system report
- Verify client environment
- Diagnose problems

## Future Enhancements

Potential additions:
- **Real-time Updates** - Auto-refresh every 30 seconds
- **Historical Data** - Charts showing resource usage over time
- **Alerts** - Notifications for critical issues
- **Export Functionality** - Download PDF/CSV reports
- **Health Checks** - Automated diagnostics
- **Comparison** - Compare with recommended settings
- **Logs Viewer** - View recent error logs
- **Cache Stats** - Object cache, transients, etc.

## Styling

### Color Scheme

- **Success**: Green (emerald-600)
- **Warning**: Yellow (amber-600)
- **Error**: Red (red-600)
- **Primary**: Blue/Indigo gradient
- **Background**: Gray-50

### Icons

All icons use Heroicons (outline style):
- Server: Server icon
- PHP: Code icon
- WordPress: Globe icon
- Database: Database icon
- Resources: Chart icon
- Actions: Lightning icon

## Testing

Test the following:
- ✅ All sections render correctly
- ✅ Status badges show proper colors
- ✅ Hover effects work on info rows
- ✅ Responsive layout (mobile/desktop)
- ✅ Icons display correctly
- ✅ Quick action buttons are clickable
- ✅ Navigation to /system works

## Documentation

The System page is:
- Located at: `/system` route
- Component: `src/pages/System.tsx`
- Route: `src/routes/system.tsx`
- Navigation: Added to Header menu

Access via:
- URL: `http://localhost:3039/system`
- Menu: Click "System" in header

