import { createContext, createResource, useContext, type JSXElement, type Resource } from 'solid-js';
import { trpc } from '../trpc';
import type { InfoResponse } from '@mamoru/auth/src/apis/info';

const UserContext = createContext<Resource<InfoResponse>>();

export const useUser = () => useContext(UserContext)!;

export default function UserProvider(props: { children: JSXElement; }) {

  const [user] = createResource(async () => {
    try {
      return await trpc.info.query();
    } catch {
      return {
        name: 'guest',
        discord: '69420'
      };
    }
  });

  return (
    <UserContext.Provider value={user}>
      {props.children}
    </UserContext.Provider>
  );
}
