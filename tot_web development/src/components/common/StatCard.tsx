import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-base p-6 rounded-xl shadow-sm border border-primary/10 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-base-dark">{title}</p>
          <h3 className="text-2xl font-bold text-secondary-indigo mt-1">{value}</h3>
          {trend && (
            <p className={`text-sm mt-1 ${trendUp ? 'text-secondary' : 'text-primary-red'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${trendUp ? 'bg-secondary/20' : 'bg-primary-red/20'}`}>
          <Icon className={`w-6 h-6 ${trendUp ? 'text-secondary' : 'text-primary-red'}`} />
        </div>
      </div>
    </div>
  );
}