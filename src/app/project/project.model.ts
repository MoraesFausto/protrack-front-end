export enum TaskStatus {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING'
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
}