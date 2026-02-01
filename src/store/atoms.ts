import { atom } from 'recoil';
import type { User, Task } from '../types';

export const usersState = atom<User[]>({
  key: 'usersState',
  default: [],
});

export const tasksState = atom<Task[]>({
  key: 'tasksState',
  default: [],
});

export const loadingState = atom<boolean>({
  key: 'loadingState',
  default: false,
});

export const errorState = atom<string | null>({
  key: 'errorState',
  default: null,
});

// Combined database state for the useDatabase hook
export const databaseState = atom({
  key: 'databaseState',
  default: {
    users: [] as User[],
    tasks: [] as Task[],
    loading: false,
    error: null as string | null,
  },
});
