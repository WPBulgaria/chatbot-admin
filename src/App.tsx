import { useState } from 'react';
import { Header } from './components/Header';
import { Options } from './pages/Options';
import { Plans } from './pages/Plans';

function App() {
  const [activeItem, setActiveItem] = useState('plans');

  const handleMenuItemClick = (id: string) => {
    setActiveItem(id);
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="mt-2 text-gray-500">Coming soon...</p>
          </div>
        );
      case 'plans':
        return <Plans />;
      case 'options':
        return <Options />;
      case 'analytics':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
            <p className="mt-2 text-gray-500">Coming soon...</p>
          </div>
        );
      default:
        return <Plans />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeItem={activeItem} onItemClick={handleMenuItemClick} />
      <main className="max-w-7xl mx-auto p-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
