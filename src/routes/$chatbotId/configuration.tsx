import { createFileRoute } from '@tanstack/react-router';
import { Options } from '../../pages/Options';
import { makeConfigsApi } from '../../api/configs-api';
import { makePlansApi } from '../../api/plans-api';
import { Configs } from '../../types/configs';
import { Plan } from '../../types/plan';

export const Route = createFileRoute('/$chatbotId/configuration')({
  loader: async ({ params }) => {
    const chatbotId = Number(params.chatbotId);
    const configsApi = makeConfigsApi();
    const PlansApi = makePlansApi();

    const result = await Promise.all([
      configsApi.get(chatbotId),
      PlansApi.get(chatbotId),
    ]);
    
    return { configs: result[0].configs as Configs, plans: result[1].plans, chatbotId: chatbotId };
  },
  component: () => {
    const {configs, plans, chatbotId} = Route.useLoaderData();
    return <Options configs={configs} plans={plans} chatbotId={chatbotId} /> 
  }
});

