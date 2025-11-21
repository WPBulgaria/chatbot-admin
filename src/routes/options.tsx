import { createFileRoute } from '@tanstack/react-router';
import { Options } from '../pages/Options';
import { makeConfigsApi } from '../api/configs-api';
import { makePlansApi } from '../api/plans-api';
import { Configs } from '../types/configs';
import { Plan } from '../types/plan';

export const Route = createFileRoute('/options')({
  loader: async () => {
    const configsApi = makeConfigsApi();
    const PlansApi = makePlansApi();

    const result = await Promise.all([
      configsApi.get(),
      PlansApi.get(),
    ]);

    return { configs: result[0] as Configs, plans: result[1] as Plan[] };
  },
  component: () => {
    const {configs, plans} = Route.useLoaderData();
    return <Options configs={configs} plans={plans} /> 
  }
});

