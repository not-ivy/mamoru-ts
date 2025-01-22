import { createContext, useContext, type JSXElement, type Resource } from 'solid-js';
import type { ServerStatusResponse } from '../types/server';

type ContextType = Resource<ServerStatusResponse>;

const ServerContext = createContext<ContextType>();

export const useServer = () => useContext(ServerContext)!;

export default function ServerProvider(props: { children: JSXElement; value: ContextType; }) {
  return (
    <ServerContext.Provider value={props.value}>
      {props.children}
    </ServerContext.Provider>
  );
}