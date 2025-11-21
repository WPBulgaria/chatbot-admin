import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
      <p className="mt-2 text-gray-500">Coming soon...</p>
    </div>
  );
}

