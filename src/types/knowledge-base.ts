export type KnowledgeBaseFile = {
  id: string;
  name: string;
  size: number;
  path: string;
  uploader: string;
  uploaderId?: string;
  createdAt: string;
  url?: string;
  type?: 'application/json' | 'application/pdf' | 'text/plain' | 'text/csv' | 'text/tab-separated-values' | 'text/tsv' | 'application/xml'
  inUse?: boolean;
};

