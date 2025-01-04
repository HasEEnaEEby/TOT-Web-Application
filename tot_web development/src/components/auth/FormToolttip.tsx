import { Info } from 'lucide-react';

interface FormTooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function FormTooltip({ text, position = 'top' }: FormTooltipProps) {
  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  return (
    <div className="relative group">
      <Info className="h-4 w-4 text-gray-400 hover:text-gray-500 cursor-help" />
      <div
        className={`absolute ${positionClasses[position]} px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50`}
      >
        {text}
      </div>
    </div>
  );
}