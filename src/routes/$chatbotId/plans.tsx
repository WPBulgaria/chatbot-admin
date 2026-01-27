import { createFileRoute } from '@tanstack/react-router';
import { Plans } from '../../pages/Plans';
import { makePlansApi } from '../../api/plans-api';
import { Plan } from '../../types/plan';

export const Route = createFileRoute('/$chatbotId/plans')({
  loader: async ({ params }) => {
    const PlansApi = makePlansApi();
    const chatbotId = Number(params.chatbotId);
    const plans = await PlansApi.get(chatbotId);
    return { plans: plans as Plan[], chatbotId: chatbotId };
  },
  component: () => {
    const { plans, chatbotId } = Route.useLoaderData();
    return <Plans plans={plans} chatbotId={chatbotId} />;
  }
});

