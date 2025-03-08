import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Task, TaskPriority, TaskType } from "../../types/taskTypes";
import { useTasks } from "../../hooks/use-tasks";
import { Button } from "../common/button";
import { Input } from "../common/InputField";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../common/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../common/ui/dropdown_menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../common/ui/select";
import { Textarea } from "../common/ui/textarea";
import MetricCard from "./MetricCard";

export default function Tasks() {
  const {
    tasks,
    metrics,
    pagination,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
  } = useTasks();

  const [newTask, setNewTask] = useState<Omit<Task, "_id">>({
    title: "",
    description: "",
    priority: "low",
    type: "general",
    status: "pending",
    dueDate: undefined,
  });

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const renderPriorityBadge = (priority: TaskPriority) => {
    const priorityClasses = {
      high: "bg-red-100 text-red-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-green-100 text-green-700",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${priorityClasses[priority]}`}
      >
        {priority}
      </span>
    );
  };

  const handleCreateTask = () => {
    createTask(newTask);
    setNewTask({
      title: "",
      description: "",
      priority: "low",
      type: "general",
      status: "pending",
      dueDate: undefined,
    });
  };
  const handleUpdateTask = () => {
    if (editingTask && editingTask._id) {
      updateTask(editingTask._id, editingTask);
      setEditingTask(null);
    }
  };
  const handleNextPage = () => {
  };

  const handlePrevPage = () => {
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Task Management</h1>

        {/* Create Task Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Create Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                label="Task Title"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    title: e.target.value,
                  })
                }
              />
              <Textarea
                placeholder="Task description"
                value={newTask.description || ""}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    description: e.target.value,
                  })
                }
              />
              <Select
                value={newTask.priority}
                onValueChange={(value: TaskPriority) =>
                  setNewTask({
                    ...newTask,
                    priority: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={newTask.type}
                onValueChange={(value: TaskType) =>
                  setNewTask({
                    ...newTask,
                    type: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="approval">Approval</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              <Input
                label="Due Date"
                type="date"
                value={
                  newTask.dueDate
                    ? format(new Date(newTask.dueDate), "yyyy-MM-dd")
                    : ""
                }
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    dueDate: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
              />
              <Button onClick={handleCreateTask} className="w-full">
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Pending Tasks"
          value={metrics.pendingTasks}
          icon={Clock}
        />
        <MetricCard
          title="Completed Tasks"
          value={metrics.completedTasks}
          icon={CheckCircle}
          trend={{
            value: metrics.completedTasks,
            isPositive: true,
          }}
        />
        <MetricCard
          title="High Priority"
          value={metrics.highPriorityTasks}
          icon={AlertCircle}
        />
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-grow">
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                <div className="mt-2 flex items-center space-x-2">
                  {renderPriorityBadge(task.priority)}
                  {task.dueDate && (
                    <span className="text-xs text-gray-500">
                      Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}
                    </span>
                  )}
                </div>
              </div>

              {/* Task Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onSelect={() => {
                      setEditingTask(task);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => completeTask(task._id!)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete Task
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => deleteTask(task._id!)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <Button
          variant="outline"
          onClick={handlePrevPage}
          disabled={pagination.currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-500">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <Button
          variant="outline"
          onClick={handleNextPage}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          Next
        </Button>
      </div>

      {/* Edit Task Dialog */}
      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                label="Task Title"
                placeholder="Enter task title"
                value={editingTask.title}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    title: e.target.value,
                  })
                }
              />
              <Textarea
                placeholder="Task description"
                value={editingTask.description || ""}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    description: e.target.value,
                  })
                }
              />
              <Select
                value={editingTask.priority}
                onValueChange={(value: TaskPriority) =>
                  setEditingTask({
                    ...editingTask,
                    priority: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={editingTask.type}
                onValueChange={(value: TaskType) =>
                  setEditingTask({
                    ...editingTask,
                    type: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="approval">Approval</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              <Input
                label="Due Date"
                type="date"
                value={
                  editingTask.dueDate
                    ? format(new Date(editingTask.dueDate), "yyyy-MM-dd")
                    : ""
                }
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    dueDate: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
              />
              <Button onClick={handleUpdateTask} className="w-full">
                Update Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
