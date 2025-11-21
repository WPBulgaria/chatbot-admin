import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Header } from '../components/Header';

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-[#f0f0f1]">
      <Header />
      <main className="max-w-7xl mx-auto p-8">
        <Outlet />
      </main>
    </div>
  ),
});

