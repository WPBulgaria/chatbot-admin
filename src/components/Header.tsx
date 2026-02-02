import { Link, useRouterState, useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';
import { Chatbot } from '../types/chatbot';
import { useCallback } from 'react';

interface MenuItem {
  path: string;
  label: string;
}

export const Header: React.FC<{ className?: string, chatbot?: Chatbot }> = ({ className, chatbot }) => {
  const router = useRouterState();
  const navigate = useNavigate();
  const currentPath = router.location.pathname;

  const defaultMenuItems: MenuItem[] = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/chatbots', label: 'Chatbots' },
  ];

  const chatbotMenuItems: MenuItem[] = [
    { path: '/$chatbotId/dashboard', label: 'Dashboard' },
    { path: '/$chatbotId/chats', label: 'Chats' },
    { path: '/$chatbotId/plans', label: 'Plans' },
    { path: '/$chatbotId/knowledge-base', label: 'Knowledge Base' },
    { path: '/$chatbotId/theme', label: 'Theme' },
    { path: '/$chatbotId/configuration', label: 'Configuration' },
  ];


  const menuItems = chatbot ? chatbotMenuItems : defaultMenuItems;

  const isActive = useCallback((path: string): boolean => {
    const segments = currentPath.split('/');
    const lastSegment = segments.pop();
    return path.includes(lastSegment || '');
  }, [currentPath]);

  const handleBackToChatbots = () => {
    navigate({ to: '/chatbots' });
  };

  return (
    <header className={clsx('bg-gray-300 border-b border-gray-300 relative z-[100000]', className)}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex flex-col relative -top-[1px]">
              <h1 className="text-base font-semibold !text-black leading-tight truncate max-w-[200px]">{!chatbot ? 'WPB Chatbot' : chatbot.title}</h1>
            </div>
          </Link>

          <nav className="flex items-center gap-0.5">
            {chatbot && (
              <button
                onClick={handleBackToChatbots}
                className="px-3 py-1.5 text-[13px] font-medium rounded transition-all duration-150 !text-black hover:bg-[#2c3338] hover:!text-white flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}
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
