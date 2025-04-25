import React from 'react';
// Fallback Card, CardContent, Button, Badge implementations
const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={classNames('rounded-2xl shadow-md bg-white relative overflow-hidden border border-gray-200 group transition-all', className)} {...props}>{children}</div>
);
const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={classNames('p-6 flex flex-col items-center', className)} {...props}>{children}</div>
);
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }> = ({ className, children, variant, ...props }) => (
  <button className={classNames('px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 focus:outline-none',
    variant === 'secondary' ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : '',
    className)} {...props}>{children}</button>
);
const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, children, ...props }) => (
  <span className={classNames('px-2 py-0.5 rounded-full text-xs font-semibold', className)} {...props}>{children}</span>
);
import { GripVertical } from 'lucide-react';
import classNames from 'classnames';
import { Habit } from '../App';

interface HabitCardProps {
  habit: Habit;
  onToggle: () => void;
  onSelect: () => void;
  order?: number; // 1-based order index, optional
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

const calculateStreaks = (logs: Record<string, boolean>) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  let current = 0;
  let d = new Date();
  while (logs[d.toISOString().split('T')[0]]) {
    current++;
    d.setDate(d.getDate() - 1);
  }

  let maxStreak = 0;
  let temp = 0;
  Object.keys(logs)
    .sort()
    .forEach(date => {
      if (logs[date]) {
        temp++;
        maxStreak = Math.max(maxStreak, temp);
      } else {
        temp = 0;
      }
    });

  return { current, max: maxStreak, completedToday: !!logs[todayStr] };
};

const priorityColors = [
  'bg-red-100 text-red-800',
  'bg-orange-100 text-orange-800',
  'bg-yellow-100 text-yellow-800',
  'bg-blue-100 text-blue-800',
];

const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onSelect, order, dragHandleProps }) => {
  // Fallbacks for compatibility with old and new habit shape
  const streak = (habit as any).streak ?? 0;
  const max = (habit as any).max ?? 0;
  const status = (habit as any).status ?? ((habit as any).completedToday ? 'complete' : 'incomplete');
  const emoji = (habit as any).emoji ?? (habit as any).icon ?? '🏆';

  return (
    <Card
      className={classNames(
        'rounded-2xl shadow-md bg-white relative overflow-hidden border border-gray-200 group transition-all',
        habit.name === 'Meditation' && 'hover:ring-2 hover:ring-yellow-300'
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
    >
      <CardContent className="p-6 flex flex-col items-center">
        {/* Drag handle (for DnD grid, always visible on mobile, hover on desktop) */}
        {dragHandleProps && (
          <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" {...dragHandleProps}>
            <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
          </div>
        )}
        {/* Order badge */}
        {typeof order === 'number' && (
          <div className="absolute top-2 left-2">
            <Badge className={classNames(priorityColors[order % priorityColors.length])}>{order + 1}</Badge>
          </div>
        )}
        <div className="text-5xl mb-2">{emoji}</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">{habit.name}</h2>
        <div className="text-gray-600 text-sm mb-4">
          <p><span className="font-medium">Streak:</span> {streak}</p>
          <p><span className="font-medium">Max:</span> {max}</p>
        </div>
        {status === 'complete' ? (
          <Button variant="secondary" disabled>Completed</Button>
        ) : (
          <Button className={classNames(priorityColors[order ? order % priorityColors.length : 0], 'hover:brightness-110')} onClick={onToggle}>
            Mark Complete
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitCard;