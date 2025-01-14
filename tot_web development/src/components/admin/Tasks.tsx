import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import MetricCard from './MetricCard';

export default function Tasks() {
  const tasks = [
    {
      id: '1',
      title: 'Review new restaurant applications',
      description: '5 restaurants waiting for approval',
      priority: 'high',
      type: 'approval',
    },
    {
      id: '2',
      title: 'Follow up on expiring subscriptions',
      description: '3 subscriptions expiring this week',
      priority: 'medium',
      type: 'subscription',
    },
    {
      id: '3',
      title: 'Update monthly financial report',
      description: 'March 2024 report needs to be generated',
      priority: 'low',
      type: 'finance',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Tasks</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Pending Tasks"
          value="8"
          icon={Clock}
        />
        <MetricCard
          title="Completed Today"
          value="5"
          icon={CheckCircle}
          trend={{ value: 2, isPositive: true }}
        />
        <MetricCard
          title="High Priority"
          value="3"
          icon={AlertCircle}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{task.description}</p>
              </div>
              <div className="flex gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    task.priority === 'high'
                      ? 'bg-red-100 text-red-700'
                      : task.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {task.priority}
                </span>
                <button
                  onClick={() => {/* Implement complete task */}}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                >
                  <CheckCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}