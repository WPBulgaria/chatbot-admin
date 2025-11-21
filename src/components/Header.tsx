import { Link, useRouterState } from '@tanstack/react-router';
import clsx from 'clsx';

interface MenuItem {
  path: string;
  label: string;
}

export const Header: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const menuItems: MenuItem[] = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/plans', label: 'Plans' },
    { path: '/options', label: 'Options' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/system', label: 'System' },
  ];

  const isActive = (path: string): boolean => {
    return currentPath === path;
  };

  return (
    <header className={clsx(`bg-white border-b border-gray-200`, className)}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/plans" className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">WP Chatbot</h1>
            <span className="text-sm text-gray-500">Admin</span>
          </Link>

          <nav className="flex items-center gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                  ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
