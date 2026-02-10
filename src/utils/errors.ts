import { ZodError } from 'zod';

export const flattenErrors = (error: ZodError) => {
    const flattened: any = {};
    error.issues.forEach((error: any) => {
      const key = error.path.join('.');
      flattened[key] = error.message;
    });
    return flattened;
  }
