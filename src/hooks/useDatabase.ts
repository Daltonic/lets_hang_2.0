import { useEffect, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { databaseState } from '../store/atoms';
import { databaseService } from '../services/database';
import type { User, Task } from '../types';

export const useDatabase = () => {
  const [state, setState] = useRecoilState(databaseState);

  const loadUsers = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const users = await databaseService.getUsers();
      setState(prev => ({ ...prev, users: users as User[], loading: false }));
    } catch {
      setState(prev => ({ ...prev, error: 'Failed to load users', loading: false }));
    }
  }, [setState]);

  const loadTasks = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const tasks = await databaseService.getTasks();
      setState(prev => ({ ...prev, tasks: tasks as Task[], loading: false }));
    } catch {
      setState(prev => ({ ...prev, error: 'Failed to load tasks', loading: false }));
    }
  }, [setState]);

  const addUser = useCallback(async (name: string, email: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await databaseService.addUser(name, email);
      await loadUsers();
    } catch {
      setState(prev => ({ ...prev, error: 'Failed to add user', loading: false }));
    }
  }, [setState, loadUsers]);

  const addTask = useCallback(async (title: string, description?: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await databaseService.addTask(title, description);
      await loadTasks();
    } catch {
      setState(prev => ({ ...prev, error: 'Failed to add task', loading: false }));
    }
  }, [setState, loadTasks]);

  const toggleTask = useCallback(async (id: number, completed: boolean) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await databaseService.toggleTask(id, completed);
      await loadTasks();
    } catch {
      setState(prev => ({ ...prev, error: 'Failed to update task', loading: false }));
    }
  }, [setState, loadTasks]);

  useEffect(() => {
    loadUsers();
    loadTasks();
  }, [loadUsers, loadTasks]);

  return {
    ...state,
    addUser,
    addTask,
    toggleTask,
    refresh: () => {
      loadUsers();
      loadTasks();
    },
  };
};
