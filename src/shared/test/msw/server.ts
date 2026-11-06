import { handlers } from '@shared/test/msw/handlers';
import { setupServer } from 'msw/node';

export const server = setupServer(...handlers);
