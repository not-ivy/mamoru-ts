import { createContext, type Accessor } from 'solid-js';
import type { UserInfo } from '../types/auth';

const AuthContext = createContext<Accessor<UserInfo | null>>();

export default AuthContext;
