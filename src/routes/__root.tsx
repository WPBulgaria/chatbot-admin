import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-[#f0f0f1]">
      <Outlet />
    </div>
  ),
});

