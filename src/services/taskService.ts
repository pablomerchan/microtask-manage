import { Task } from '../types';

const DELAY_MS = 400;
const STORAGE_TASKS_KEY = 'micro_tasks';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  /**
   * Get all tasks for a specific user.
   * Simulates GET /api/v1/tasks?userId=...
   */
  getTasks: async (userId: string): Promise<Task[]> => {
    await delay(DELAY_MS);
    const tasksRaw = localStorage.getItem(STORAGE_TASKS_KEY);
    const allTasks: Task[] = tasksRaw ? JSON.parse(tasksRaw) : [];
    return allTasks.filter(t => t.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  /**
   * Create a new task.
   * Simulates POST /api/v1/tasks
   */
  createTask: async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    await delay(DELAY_MS);
    const tasksRaw = localStorage.getItem(STORAGE_TASKS_KEY);
    const allTasks: Task[] = tasksRaw ? JSON.parse(tasksRaw) : [];

    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    allTasks.push(newTask);
    localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(allTasks));
    return newTask;
  },

  /**
   * Update an existing task.
   * Simulates PUT /api/v1/tasks/:id
   */
  updateTask: async (task: Task): Promise<Task> => {
    await delay(DELAY_MS);
    const tasksRaw = localStorage.getItem(STORAGE_TASKS_KEY);
    const allTasks: Task[] = tasksRaw ? JSON.parse(tasksRaw) : [];

    const index = allTasks.findIndex(t => t.id === task.id);
    if (index === -1) throw new Error('Task not found');

    allTasks[index] = task;
    localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(allTasks));
    return task;
  },

  /**
   * Delete a task.
   * Simulates DELETE /api/v1/tasks/:id
   */
  deleteTask: async (taskId: string): Promise<void> => {
    await delay(DELAY_MS);
    const tasksRaw = localStorage.getItem(STORAGE_TASKS_KEY);
    const allTasks: Task[] = tasksRaw ? JSON.parse(tasksRaw) : [];

    const filteredTasks = allTasks.filter(t => t.id !== taskId);
    localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(filteredTasks));
  }
};