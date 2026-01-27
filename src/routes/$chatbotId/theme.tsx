import { createFileRoute } from '@tanstack/react-router';
import { Theme } from '../../pages/Theme';
import { makeConfigsApi } from '../../api/configs-api';
import type { Configs } from '../../types/configs';

type LoaderData = {
  configs: Configs;
  chatbotId: number;
};

export const Route = createFileRoute('/$chatbotId/theme')({
  loader: async ({ params }): Promise<LoaderData> => {
    const chatbotId = Number(params.chatbotId);
    const configsApi = makeConfigsApi();
    const configs = await configsApi.get(chatbotId);
    return { configs, chatbotId: chatbotId };
  },
  component: () => {
    const { configs, chatbotId } = Route.useLoaderData() as LoaderData;
    return <Theme configs={configs} chatbotId={chatbotId} />;
  },
});
