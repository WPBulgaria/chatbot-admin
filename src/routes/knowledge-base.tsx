import { createFileRoute } from '@tanstack/react-router';
import { KnowledgeBase } from '../pages/KnowledgeBase';
import { makePlansApi } from '../api/plans-api';
import type { Plan } from '../types/plan';

export const Route = createFileRoute('/knowledge-base')({
  loader: async () => {
    const plansApi = makePlansApi();
    const plans = await plansApi.get();
    return plans as Plan[];
  },
  component: () => {
    const plans = Route.useLoaderData();
    return <KnowledgeBase plans={plans} />;
  },
});

