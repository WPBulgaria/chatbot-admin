import { createFileRoute } from '@tanstack/react-router';
import { Plans } from '../pages/Plans';
import { makePlansApi } from '../api/plans-api';
import { Plan } from '../types/plan';

export const Route = createFileRoute('/plans')({
  loader: async () => {
    const PlansApi = makePlansApi();
    const plans = await PlansApi.get();
    return plans as Plan[];
  },
  component: () => {
    const plans = Route.useLoaderData();
    return <Plans plans={plans} />;
  }
});

