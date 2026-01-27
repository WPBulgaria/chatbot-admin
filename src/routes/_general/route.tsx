import { createFileRoute } from '@tanstack/react-router'
import { Header } from '../../components/Header';
import { Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_general')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto p-8">
        <Outlet />
      </main>
    </>
  );
}
