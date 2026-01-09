export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Pending' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  due_date: string;
  status: Status;
  created_at: string;
  updated_at: string;
}
