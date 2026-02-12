/**
 * Worker Registry Service
 * Manages and tracks Sovereign AI workers/agents
 */

export interface WorkerInfo {
  id: string;
  name: string;
  type: 'constitutional' | 'security' | 'learning' | 'system';
  status: 'idle' | 'busy' | 'error' | 'offline';
  model?: string;
  capabilities: string[];
  currentTask?: string;
  lastActive: Date;
  performance: {
    tasksCompleted: number;
    successRate: number;
    averageResponseTime: number;
  };
}

export interface WorkerTask {
  id: string;
  workerId: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  result?: any;
  error?: string;
}

class WorkerRegistry {
  private workers: Map<string, WorkerInfo> = new Map();
  private tasks: Map<string, WorkerTask> = new Map();
  private listeners: Set<(workers: WorkerInfo[]) => void> = new Set();

  constructor() {
    // Initialize with default constitutional workers
    this.registerWorker({
      id: 'council-chief',
      name: 'Constitutional Council',
      type: 'constitutional',
      status: 'idle',
      capabilities: ['constitutional_review', 'code_audit', 'vibe_scoring'],
      lastActive: new Date(),
      performance: {
        tasksCompleted: 0,
        successRate: 100,
        averageResponseTime: 0
      }
    });

    this.registerWorker({
      id: 'jarvis-scanner',
      name: 'JARVIS Security Scanner',
      type: 'security',
      status: 'idle',
      capabilities: ['vulnerability_scan', 'secret_detection', 'dependency_audit'],
      lastActive: new Date(),
      performance: {
        tasksCompleted: 0,
        successRate: 100,
        averageResponseTime: 0
      }
    });

    this.registerWorker({
      id: 'rezcopilot',
      name: 'RezCopilot',
      type: 'learning',
      status: 'idle',
      capabilities: ['code_generation', 'explanation', 'tutorial'],
      lastActive: new Date(),
      performance: {
        tasksCompleted: 0,
        successRate: 100,
        averageResponseTime: 0
      }
    });
  }

  registerWorker(worker: Omit<WorkerInfo, 'id'> & { id?: string }): WorkerInfo {
    const id = worker.id || `worker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newWorker: WorkerInfo = {
      ...worker,
      id,
      lastActive: new Date(),
      performance: worker.performance || {
        tasksCompleted: 0,
        successRate: 100,
        averageResponseTime: 0
      }
    };
    this.workers.set(id, newWorker);
    this.notifyListeners();
    return newWorker;
  }

  updateWorkerStatus(workerId: string, status: WorkerInfo['status'], task?: string): void {
    const worker = this.workers.get(workerId);
    if (worker) {
      worker.status = status;
      worker.currentTask = task;
      worker.lastActive = new Date();
      this.workers.set(workerId, worker);
      this.notifyListeners();
    }
  }

  getWorkers(): WorkerInfo[] {
    return Array.from(this.workers.values());
  }

  getWorker(workerId: string): WorkerInfo | undefined {
    return this.workers.get(workerId);
  }

  unregisterWorker(workerId: string): boolean {
    const result = this.workers.delete(workerId);
    this.notifyListeners();
    return result;
  }

  createTask(workerId: string, type: string): WorkerTask {
    const task: WorkerTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      workerId,
      type,
      status: 'pending',
      createdAt: new Date()
    };
    this.tasks.set(task.id, task);
    return task;
  }

  updateTask(taskId: string, status: WorkerTask['status'], result?: any, error?: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = status;
      task.result = result;
      task.error = error;
      if (status === 'completed' || status === 'failed') {
        task.completedAt = new Date();
      }
      this.tasks.set(taskId, task);
      
      const worker = this.workers.get(task.workerId);
      if (worker) {
        worker.performance.tasksCompleted++;
        if (status === 'completed') {
          worker.performance.successRate = 
            (worker.performance.successRate * (worker.performance.tasksCompleted - 1) + 100) / 
            worker.performance.tasksCompleted;
        } else {
          worker.performance.successRate = 
            (worker.performance.successRate * (worker.performance.tasksCompleted - 1) + 0) / 
            worker.performance.tasksCompleted;
        }
        this.workers.set(task.workerId, worker);
      }
      this.notifyListeners();
    }
  }

  getWorkerTasks(workerId: string): WorkerTask[] {
    return Array.from(this.tasks.values()).filter(task => task.workerId === workerId);
  }

  getAllTasks(): WorkerTask[] {
    return Array.from(this.tasks.values());
  }

  subscribe(callback: (workers: WorkerInfo[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.getWorkers());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(): void {
    const workers = this.getWorkers();
    this.listeners.forEach(callback => {
      try {
        callback(workers);
      } catch (error) {
        console.error('Error notifying listener:', error);
      }
    });
  }

  resetAllWorkers(): void {
    this.workers.forEach((worker, id) => {
      worker.status = 'idle';
      worker.currentTask = undefined;
      worker.lastActive = new Date();
      this.workers.set(id, worker);
    });
    this.notifyListeners();
  }

  getStats(): {
    totalWorkers: number;
    activeWorkers: number;
    totalTasks: number;
    completedTasks: number;
    successRate: number;
  } {
    const workers = this.getWorkers();
    const tasks = this.getAllTasks();
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    
    return {
      totalWorkers: workers.length,
      activeWorkers: workers.filter(w => w.status === 'busy').length,
      totalTasks: tasks.length,
      completedTasks,
      successRate: completedTasks > 0 
        ? (completedTasks / tasks.length) * 100 
        : 100
    };
  }
}

// Create and export singleton instance
export const workerRegistry = new WorkerRegistry();

// Also export default for flexibility
export default workerRegistry;
