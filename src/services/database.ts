// Browser-compatible database service using localStorage
import type { User, Task } from '../types';

class DatabaseService {
  private usersKey = 'letshang_users';
  private tasksKey = 'letshang_tasks';

  async init() {
    // Initialize with default data if empty
    if (!localStorage.getItem(this.usersKey)) {
      localStorage.setItem(this.usersKey, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.tasksKey)) {
      localStorage.setItem(this.tasksKey, JSON.stringify([]));
    }
  }

  async getUsers(): Promise<User[]> {
    await this.init();
    const data = localStorage.getItem(this.usersKey);
    return data ? JSON.parse(data) : [];
  }

  async getTasks(): Promise<Task[]> {
    await this.init();
    const data = localStorage.getItem(this.tasksKey);
    return data ? JSON.parse(data) : [];
  }

  async addUser(name: string, email: string): Promise<void> {
    const users = await this.getUsers();
    const newUser = {
      id: Date.now(),
      name,
      email,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  async addTask(title: string, description?: string): Promise<void> {
    const tasks = await this.getTasks();
    const newTask: Task = {
      id: Date.now(),
      title,
      description: description || undefined,
      completed: false,
      created_at: new Date().toISOString()
    };
    tasks.push(newTask);
    localStorage.setItem(this.tasksKey, JSON.stringify(tasks));
  }

  async toggleTask(id: number, completed: boolean): Promise<void> {
    const tasks = await this.getTasks();
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed } : task
    );
    localStorage.setItem(this.tasksKey, JSON.stringify(updatedTasks));
  }

  async close() {
    // No cleanup needed for localStorage
  }
}

export const databaseService = new DatabaseService();
