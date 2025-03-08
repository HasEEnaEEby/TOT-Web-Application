// src/hooks/use-tasks.ts
import { useCallback, useEffect, useState } from 'react';
import taskApi from '../api/taskApi';
import { useToast } from '../hooks/use-toast';
import { Task, TaskMetrics } from '../types/taskTypes';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [metrics, setMetrics] = useState<TaskMetrics>({
    pendingTasks: 0,
    completedTasks: 0,
    highPriorityTasks: 0
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchTasks = useCallback(async (params = {}) => {
    try {
      setIsLoading(true);
      const response = await taskApi.getTasks({
        page: pagination.currentPage,
        ...params
      });
      
      // Set tasks safely
      setTasks(response.tasks || []);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalTasks: response.totalTasks
      });
    } catch (err) {
      // Handle errors
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks',
        variant: 'destructive'
      });
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.currentPage, toast]);
  // Fetch task metrics
  const fetchTaskMetrics = useCallback(async () => {
    try {
      const response = await taskApi.getTaskMetrics();
      setMetrics(response);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to fetch task metrics',
        variant: 'destructive'
      });
      console.error('Error fetching task metrics:', err);
    }
  }, [toast]);

  // Create task
  const createTask = useCallback(async (taskData: Partial<Task>) => {
    try {
      setIsLoading(true);
      await taskApi.createTask(taskData);
      toast({
        title: 'Success',
        description: 'Task created successfully',
        variant: 'default'
      });
      fetchTasks(); // Refresh tasks
      fetchTaskMetrics(); // Refresh metrics
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive'
      });
      console.error('Error creating task:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTasks, fetchTaskMetrics, toast]);

  // Update task
  const updateTask = useCallback(async (id: string, taskData: Partial<Task>) => {
    try {
      setIsLoading(true);
      await taskApi.updateTask(id, taskData);
      toast({
        title: 'Success',
        description: 'Task updated successfully',
        variant: 'default'
      });
      fetchTasks(); // Refresh tasks
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive'
      });
      console.error('Error updating task:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTasks, toast]);

  // Complete task
  const completeTask = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      await taskApi.completeTask(id);
      toast({
        title: 'Success',
        description: 'Task marked as complete',
        variant: 'default'
      });
      fetchTasks(); // Refresh tasks
      fetchTaskMetrics(); // Refresh metrics
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to complete task',
        variant: 'destructive'
      });
      console.error('Error completing task:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTasks, fetchTaskMetrics, toast]);

  // Delete task
  const deleteTask = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      await taskApi.deleteTask(id);
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
        variant: 'default'
      });
      fetchTasks(); // Refresh tasks
      fetchTaskMetrics(); // Refresh metrics
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive'
      });
      console.error('Error deleting task:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTasks, fetchTaskMetrics, toast]);

  // Initial fetch when hook is used
  useEffect(() => {
    fetchTasks();
    fetchTaskMetrics();
  }, [fetchTasks, fetchTaskMetrics]);

  return {
    tasks,
    metrics,
    pagination,
    isLoading,
    fetchTasks,
    fetchTaskMetrics,
    createTask,
    updateTask,
    completeTask,
    deleteTask
  };
};