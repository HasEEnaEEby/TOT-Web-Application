interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; 
    trend?: {
      value: number;
      isPositive: boolean;
    };
    description?: string;
  }
  
  export default function MetricCard({ title, value, icon: Icon, trend, description }: MetricCardProps) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
            {trend && (
              <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </p>
            )}
            {description && (
              <p className="text-sm mt-1 text-gray-400">{description}</p> 
            )}
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <Icon className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>
    );
  }
  