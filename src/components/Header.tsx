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
    { path: '/chats', label: 'Chats' },
    { path: '/plans', label: 'Plans' },
    { path: '/knowledge-base', label: 'Knowledge Base' },
    { path: '/options', label: 'Options' },
  ];

  const isActive = (path: string): boolean => {
    return currentPath === path;
  };

  return (
    <header className={clsx('bg-gray-300 border-b border-gray-300 relative z-[100000]', className)}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex flex-col">
              <h1 className="text-base font-semibold !text-black leading-tight">WordPress Assistant</h1>
            </div>
          </Link>

          <nav className="flex items-center gap-0.5">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'px-3 py-1.5 text-[13px] font-medium rounded transition-all duration-150',
                  isActive(item.path)
                    ? 'bg-[#2271b1] !text-white'
                    : '!text-black hover:bg-[#2c3338] hover:!text-white'
                )}
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
