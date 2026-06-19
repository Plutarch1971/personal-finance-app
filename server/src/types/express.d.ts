import { AuthPayload } from './jwt';

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email?: string;
      username?: string;
    };
  }
}