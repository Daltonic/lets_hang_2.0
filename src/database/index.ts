import type { User, Task } from '../types';

// Mock database using localStorage for browser compatibility
// Note: SQLite3 in package.json won't work in the browser
class DatabaseService {
  private readonly USERS_KEY = 'letshang_users';
  private readonly TASKS_KEY = 'letshang_tasks';

  // Initialize database (create tables if not exist)
  async initialize(): Promise<void> {
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.TASKS_KEY)) {
      localStorage.setItem(this.TASKS_KEY, JSON.stringify([]));
    }
  }

  // User operations
  async getUsers(): Promise<User[]> {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  async addUser(name: string, email: string): Promise<User> {
    const users = await this.getUsers();
    const newUser: User = {
      id: Date.now(),
      name,
      email,
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return newUser;
  }

  async deleteUser(id: number): Promise<void> {
    const users = await this.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(filteredUsers));
  }

  // Task operations
  async getTasks(): Promise<Task[]> {
    const tasks = localStorage.getItem(this.TASKS_KEY);
    return tasks ? JSON.parse(tasks) : [];
  }

  async addTask(title: string, description?: string): Promise<Task> {
    const tasks = await this.getTasks();
    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      completed: false,
      created_at: new Date().toISOString(),
    };
    tasks.push(newTask);
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
    return newTask;
  }

  async updateTask(id: number, completed: boolean): Promise<void> {
    const tasks = await this.getTasks();
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed } : task
    );
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(updatedTasks));
  }

  async deleteTask(id: number): Promise<void> {
    const tasks = await this.getTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(filteredTasks));
  }
}

export const database = new DatabaseService();