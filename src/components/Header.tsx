interface MenuItem {
  id: string;
  label: string;
}

interface HeaderProps {
  activeItem: string;
  onItemClick: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeItem, onItemClick }) => {
  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'plans', label: 'Plans' },
    { id: 'options', label: 'Options' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">WP Chatbot</h1>
            <span className="text-sm text-gray-500">Admin</span>
          </div>

          <nav className="flex items-center gap-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className={`
                  px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                  ${
                    activeItem === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
