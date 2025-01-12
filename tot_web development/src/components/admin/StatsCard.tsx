import clsx from 'clsx';
import { TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ElementType;
  color?: 'primary' | 'secondary' | 'success';
  description?: string;
}

export default function StatsCard({
    title,
    value,
    trend,
    icon: Icon,
    color = 'primary',
    description
  }: StatsCardProps) {
    const colorClasses = {
      primary: 'bg-primary-50 text-primary-600',
      secondary: 'bg-secondary/10 text-secondary',
      success: 'bg-success/10 text-success',
    };
  
    return (
      <div className="relative bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group backdrop-blur-sm bg-white/50">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className={clsx(
              'p-3 rounded-lg transition-all duration-300 group-hover:scale-110',
              colorClasses[color]
            )}>
              <Icon />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-primary-700 group-hover:scale-105 transition-transform">
            {value}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            {trend !== undefined && (
              <div className="flex items-center gap-1">
                {trend >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-danger" />
                )}
                <span className={clsx(
                  "text-sm font-medium",
                  trend >= 0 ? "text-success" : "text-danger"
                )}>
                  {trend >= 0 ? "+" : ""}{trend}%
                </span>
              </div>
            )}
            {description && (
              <span className="text-sm text-gray-500">{description}</span>
            )}
          </div>
        </div>
      </div>
    );
  }
  