import { GripVertical } from "lucide-react";
import classNames from "classnames";
import { getLocalDateString } from "../utils/date";

// Fallback Card, CardContent, Button, Badge implementations
const Card = ({ className, children, ...props }) => (
  <div
    className={classNames(
      "rounded-2xl shadow-md bg-white relative overflow-hidden border border-gray-200 group transition-all",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
const CardContent = ({ className, children, ...props }) => (
  <div
    className={classNames("p-6 flex flex-col items-center", className)}
    {...props}
  >
    {children}
  </div>
);
const Button = ({ className, children, variant, ...props }) => (
  <button
    className={classNames(
      "px-4 py-2 rounded-full text- font-medium transition-colors duration-150 focus:outline-none",
      variant === "secondary"
        ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
        : "",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
const Badge = ({ className, children, ...props }) => (
  <span
    className={classNames(
      "px-2 py-0.5 rounded-full text-xs font-semibold",
      className,
    )}
    {...props}
  >
    {children}
  </span>
);

const DragHandle = ({ dragHandleProps }) => {
  if (!dragHandleProps) return null;

  return (
    <div
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      {...dragHandleProps}
    >
      <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
    </div>
  );
};

const priorityColors = [
  "bg-red-100 text-red-800",
  "bg-orange-100 text-orange-800",
  "bg-yellow-100 text-yellow-800",
  "bg-blue-100 text-blue-800",
];

const HabitCard = ({ habit, onToggle, onSelect, order, dragHandleProps }) => {
  // Compute completion status for today directly from logs
  const todayStr = getLocalDateString();
  const completedToday = habit.logs && habit.logs[todayStr];
  const status = completedToday ? "complete" : "incomplete";
  const emoji = habit.emoji ?? habit.icon ?? "🏆";

  // Compute completed days from logs
  const completedDays = habit.logs
    ? Object.values(habit.logs).filter(Boolean).length
    : 0;

  // Handle card click to open details modal
  const handleCardClick = (e) => {
    e.preventDefault();
    onSelect();
  };

  return (
    <Card
      className="rounded-2xl shadow-md bg-white relative overflow-hidden border border-gray-200 group transition-all hover:ring-2 hover:ring-yellow-300"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      <CardContent className="p-6 flex flex-col items-center">
        {/* Drag handle component */}
        <DragHandle dragHandleProps={dragHandleProps} />
        {/* Order badge */}
        {typeof order === "number" && (
          <div className="absolute top-2 left-2">
            <Badge
              className={classNames(
                priorityColors[order % priorityColors.length],
              )}
            >
              {order + 1}
            </Badge>
          </div>
        )}
        <div className="text-5xl mb-2">{emoji}</div>
        <h2 className="text-xl font-semibold text-color-title mb-2 text-center">
          {habit.name}
        </h2>
        {/* Display the number of times the habit has been completed */}
        <div className="text-gray-600 text-sm mb-4">
          <p>
            <span className="font-medium">Completed Days:</span> {completedDays}
          </p>
        </div>
        {status === "complete" ? (
          <Button variant="secondary" disabled>
            Completed
          </Button>
        ) : (
          <Button
            className={classNames(
              priorityColors[order ? order % priorityColors.length : 0],
              "hover:brightness-110",
            )}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            Mark Complete
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitCard;
