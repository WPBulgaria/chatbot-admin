import { createFileRoute } from '@tanstack/react-router';
import { Options } from '../../pages/Options';
import { makeConfigsApi } from '../../api/configs-api';
import { makePlansApi } from '../../api/plans-api';
import { chatbotsApi } from '../../api/chatbots-api';
import { Configs } from '../../types/configs';

export const Route = createFileRoute('/$chatbotId/configuration')({
  loader: async ({ params }) => {
    const chatbotId = Number(params.chatbotId);
    const configsApi = makeConfigsApi();
    const PlansApi = makePlansApi();

    const result = await Promise.all([
      configsApi.get(chatbotId),
      PlansApi.get(chatbotId),
      chatbotsApi.get(chatbotId),
    ]);
    
    return { models: result[2].chatbot.models || [], configs: result[0].configs as Configs, plans: result[1].plans, chatbotId: chatbotId };
  },
  component: () => {
    const {models, configs, plans, chatbotId} = Route.useLoaderData();
    return <Options models={models} configs={configs} plans={plans} chatbotId={chatbotId} /> 
  }
});

