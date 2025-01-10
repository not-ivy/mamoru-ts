import { createContext, type Resource } from 'solid-js';
import type { ServerStatusResponse } from '../types/server';

const ServerContext = createContext<Resource<ServerStatusResponse | null>>();

export default ServerContext;
