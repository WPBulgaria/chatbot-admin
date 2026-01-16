import { createFileRoute } from '@tanstack/react-router';
import { KnowledgeBase } from '../pages/KnowledgeBase';
import type { KnowledgeBaseFile } from '../types/knowledge-base.ts';
import { makeFilesApi } from '../api/files-api.tsx';

export const Route = createFileRoute('/knowledge-base')({
  loader: async () => {
    const filesApi = makeFilesApi();
    const data = await filesApi.list();
    return data.files as KnowledgeBaseFile[];
  },
  component: () => {
    const files = Route.useLoaderData();
    return <KnowledgeBase files={files} />;
  },
});

