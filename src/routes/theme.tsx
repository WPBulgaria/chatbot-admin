import { createFileRoute } from '@tanstack/react-router';
import { Theme } from '../pages/Theme';
import { makeConfigsApi } from '../api/configs-api';
import type { Configs } from '../types/configs';

type LoaderData = {
  configs: Configs;
};

export const Route = createFileRoute('/theme')({
  loader: async (): Promise<LoaderData> => {
    const configsApi = makeConfigsApi();
    const configs = await configsApi.get();
    return { configs };
  },
  component: () => {
    const { configs } = Route.useLoaderData() as LoaderData;
    return <Theme configs={configs} />;
  },
});
