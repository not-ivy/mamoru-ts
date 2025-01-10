import { createContext, type Resource } from 'solid-js';
import type { InfoResponse } from '../types/auth';

const AuthContext = createContext<Resource<InfoResponse | null>>();

export default AuthContext;
