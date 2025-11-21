import { ZodError } from 'zod';

export const flattenErrors = (error: ZodError, path: number = 0) => {
    const flattened: any = {};
    error.issues.forEach((error: any) => {
      flattened[error.path[0]] = error.message;
    });
    return flattened;
  }
