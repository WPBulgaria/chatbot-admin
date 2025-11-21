import { Card } from '../components/Card';

interface SystemInfo {
  label: string;
  value: string;
  status?: 'success' | 'warning' | 'error';
}

export const System: React.FC = () => {
  const serverInfo: SystemInfo[] = [
    { label: 'Operating System', value: 'Linux Ubuntu 22.04 LTS', status: 'success' },
    { label: 'Server Software', value: 'Apache/2.4.52' },
    { label: 'Hostname', value: 'wp-chatbot-server.local' },
    { label: 'Server IP', value: '192.168.1.100' },
    { label: 'Server Time', value: new Date().toLocaleString() },
    { label: 'Uptime', value: '15 days, 6 hours' },
  ];

  const phpInfo: SystemInfo[] = [
    { label: 'PHP Version', value: '8.2.10', status: 'success' },
    { label: 'Memory Limit', value: '256M', status: 'success' },
    { label: 'Max Execution Time', value: '300 seconds' },
    { label: 'Post Max Size', value: '128M' },
    { label: 'Upload Max Filesize', value: '128M' },
    { label: 'Max Input Vars', value: '5000' },
    { label: 'PHP Extensions', value: '45 loaded' },
    { label: 'Opcache', value: 'Enabled', status: 'success' },
  ];

  const wordpressInfo: SystemInfo[] = [
    { label: 'WordPress Version', value: '6.4.2', status: 'success' },
    { label: 'Site URL', value: 'https://example.com' },
    { label: 'Home URL', value: 'https://example.com' },
    { label: 'WP Content Directory', value: '/var/www/html/wp-content' },
    { label: 'Active Theme', value: 'Twenty Twenty-Four' },
    { label: 'Active Plugins', value: '12 plugins' },
    { label: 'Database Version', value: 'MySQL 8.0.32' },
    { label: 'Database Charset', value: 'utf8mb4' },
  ];

  const databaseInfo: SystemInfo[] = [
    { label: 'Database Server', value: 'MySQL 8.0.32', status: 'success' },
    { label: 'Database Name', value: 'wp_chatbot_db' },
    { label: 'Database Size', value: '145.7 MB' },
    { label: 'Tables Count', value: '28 tables' },
    { label: 'Max Connections', value: '151' },
    { label: 'Connection Charset', value: 'utf8mb4' },
  ];

  const resourceInfo: SystemInfo[] = [
    { label: 'Total Disk Space', value: '250 GB' },
    { label: 'Used Disk Space', value: '89.4 GB (35.8%)', status: 'success' },
    { label: 'Free Disk Space', value: '160.6 GB' },
    { label: 'Total Memory', value: '16 GB' },
    { label: 'Used Memory', value: '8.2 GB (51.3%)', status: 'success' },
    { label: 'Free Memory', value: '7.8 GB' },
    { label: 'CPU Usage', value: '24%', status: 'success' },
    { label: 'Load Average', value: '1.23, 1.45, 1.67' },
  ];

  const getStatusColor = (status?: 'success' | 'warning' | 'error'): string => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-900';
    }
  };

  const getStatusBadge = (status?: 'success' | 'warning' | 'error') => {
    if (!status) return null;

    const colors = {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
    };

    const icons = {
      success: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      warning: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      error: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderInfoSection = (title: string, items: SystemInfo[], icon: React.ReactNode) => (
    <Card>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-2 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
            <span className="text-sm text-gray-600">{item.label}</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                {item.value}
              </span>
              {item.status && getStatusBadge(item.status)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">System Information</h1>
        <p className="mt-1 text-sm text-gray-500">
          Server stats, PHP configuration, and WordPress setup
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderInfoSection(
          'Server Information',
          serverInfo,
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
        )}

        {renderInfoSection(
          'PHP Configuration',
          phpInfo,
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        )}

        {renderInfoSection(
          'WordPress Setup',
          wordpressInfo,
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        )}

        {renderInfoSection(
          'Database Information',
          databaseInfo,
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        )}

        {renderInfoSection(
          'System Resources',
          resourceInfo,
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )}

        <Card className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Refresh Stats</p>
                <p className="text-xs text-gray-500">Update system info</p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Export Report</p>
                <p className="text-xs text-gray-500">Download system report</p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Check Health</p>
                <p className="text-xs text-gray-500">Run health diagnostics</p>
              </div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

