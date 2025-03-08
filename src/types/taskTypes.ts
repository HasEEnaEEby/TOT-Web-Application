// // src/types/tableTypes.ts
// export interface TablePosition {
//   x: number;
//   y: number;
// }

// export type TableStatus = 'available' | 'occupied' | 'reserved';

// export interface TableData {
//   _id?: string;
//   id?: string;
//   number: number;
//   capacity: number;
//   status: TableStatus;
//   position?: TablePosition;
//   restaurant?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface TableCreateRequest {
//   number: number;
//   capacity: number;
//   position?: TablePosition;
//   status?: TableStatus;
// }

// export interface TableUpdateRequest {
//   number?: number;
//   capacity?: number;
//   position?: TablePosition;
//   status?: TableStatus;
// }

// src/types/taskTypes.ts
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskType = 'general' | 'approval' | 'subscription' | 'finance';

export interface Task {
  _id?: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  type: TaskType;
  dueDate?: string | Date;
  createdAt?: string;
  updatedAt?: string;
  assignedTo?: string;
  createdBy?: string;
}

export interface TaskMetrics {
  pendingTasks: number;
  completedTasks: number;
  highPriorityTasks: number;
}