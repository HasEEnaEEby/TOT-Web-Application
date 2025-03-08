import { Task, TaskMetrics } from "../types/taskTypes";
import axiosInstance from "./axiosConfig";

class TaskAPI {
  private static readonly BASE_PATH = "/tasks";

  /**
   * Fetch tasks with optional filters
   */
  async getTasks(params = {}): Promise<{
    tasks: Task[];
    currentPage: number;
    totalPages: number;
    totalTasks: number;
  }> {
    console.log("📢 Fetching tasks with params:", params);
    try {
      const response = await axiosInstance.get(TaskAPI.BASE_PATH, {
        params,
      });

      console.log("✅ Tasks fetched:", response.data);
      if (response.data.status === 'success') {
        return {
          tasks: response.data.data?.tasks || response.data.tasks || [],
          currentPage: response.data.currentPage || 1,
          totalPages: response.data.totalPages || 1,
          totalTasks: response.data.totalTasks || 0
        };
      }
      
      return {
        tasks: [],
        currentPage: 1,
        totalPages: 1,
        totalTasks: 0
      };
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
      return {
        tasks: [],
        currentPage: 1,
        totalPages: 1,
        totalTasks: 0
      };
    }
  }

  /**
   * Fetch task metrics
   */
  async getTaskMetrics(): Promise<TaskMetrics> {
    console.log("📢 Fetching task metrics");
    try {
      const response = await axiosInstance.get(`${TaskAPI.BASE_PATH}/metrics`);
      
      console.log("✅ Task metrics fetched:", response.data);
      
      if (response.data.status === 'success') {
        return {
          pendingTasks: response.data.data?.pendingTasks || 0,
          completedTasks: response.data.data?.completedTasks || 0,
          highPriorityTasks: response.data.data?.highPriorityTasks || 0
        };
      }
      
      return {
        pendingTasks: 0,
        completedTasks: 0,
        highPriorityTasks: 0
      };
    } catch (error) {
      console.error("❌ Error fetching task metrics:", error);
      return {
        pendingTasks: 0,
        completedTasks: 0,
        highPriorityTasks: 0
      };
    }
  }

  /**
   * Create a new task
   */
  async createTask(taskData: Partial<Task>): Promise<Task> {
    console.log("📢 Creating task:", taskData);
    try {
      const response = await axiosInstance.post(TaskAPI.BASE_PATH, taskData);
      
      console.log("✅ Task created:", response.data);
      return response.data.data?.task || response.data.data || {};
    } catch (error) {
      console.error("❌ Error creating task:", error);
      throw error;
    }
  }

  /**
   * Update a task
   */
  async updateTask(id: string, taskData: Partial<Task>): Promise<Task> {
    console.log("📢 Updating task:", id, taskData);
    try {
      const response = await axiosInstance.patch(
        `${TaskAPI.BASE_PATH}/${id}`,
        taskData
      );
      
      console.log("✅ Task updated:", response.data);
      return response.data.data?.task || response.data.data || {};
    } catch (error) {
      console.error("❌ Error updating task:", error);
      throw error;
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    console.log("📢 Deleting task:", id);
    try {
      await axiosInstance.delete(`${TaskAPI.BASE_PATH}/${id}`);
      console.log("✅ Task deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting task:", error);
      throw error;
    }
  }

  /**
   * Mark a task as complete
   */
  async completeTask(id: string): Promise<Task> {
    console.log("📢 Marking task as complete:", id);
    try {
      const response = await axiosInstance.patch(
        `${TaskAPI.BASE_PATH}/${id}/complete`
      );
      
      console.log("✅ Task marked as complete:", response.data);
      return response.data.data?.task || response.data.data || {};
    } catch (error) {
      console.error("❌ Error completing task:", error);
      throw error;
    }
  }
}

const taskApi = new TaskAPI();
export default taskApi;