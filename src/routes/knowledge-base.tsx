import { createFileRoute } from '@tanstack/react-router';
import { KnowledgeBase } from '../pages/KnowledgeBase';
import type { KnowledgeBaseFile } from '../types/knowledge-base.ts';

export const Route = createFileRoute('/knowledge-base')({
  loader: async () => {
    return [] as KnowledgeBaseFile[];
  },
  component: () => {
    const files = Route.useLoaderData();
    return <KnowledgeBase files={files} />;
  },
});

