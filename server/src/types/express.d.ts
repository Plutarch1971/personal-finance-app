import 'express-serve-static-core';
import { AuthPayload } from './jwt';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthPayload;
  }
}