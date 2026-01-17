import { ZodError } from 'zod';

export const flattenErrors = (error: ZodError) => {
    const flattened: any = {};
    error.issues.forEach((error: any) => {
      flattened[error.path[0]] = error.message;
    });
    return flattened;
  }
