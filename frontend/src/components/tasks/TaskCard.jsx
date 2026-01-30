import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Edit3,
  Trash2,
  CheckCircle,
  Circle,
  AlertTriangle,
  Calendar,
  Flag,
  MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';
import { useTask } from '../../context/TaskContext';
import { showToast } from '../common/Toast';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { getAnimationProps, shouldReduceMotion } from '../../utils/animationUtils';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { toggleTaskCompletion } = useTask();
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleCompletion = async () => {
    try {
      await toggleTaskCompletion(task._id);
      showToast.success(`Task marked as ${task.status === 'completed' ? 'incomplete' : 'completed'}!`);
    } catch (error) {
      showToast.error('Failed to update task status');
    }
  };

  const priorityColors = {
    high: 'border-l-priority-high',
    medium: 'border-l-priority-medium',
    low: 'border-l-priority-low'
  };

  const statusColors = {
    pending: 'bg-status-pending',
    in_progress: 'bg-status-progress',
    completed: 'bg-status-completed'
  };

  const priorityIcons = {
    high: AlertTriangle,
    medium: Flag,
    low: Flag
  };

  const PriorityIcon = priorityIcons[task.priority];

  const animationProps = shouldReduceMotion() 
    ? { className: `bg-dark-secondary rounded-xl border border-dark-card p-4 mb-3 ${priorityColors[task.priority] || ''}` }
    : {
        ...getAnimationProps({
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          whileHover: { y: -2 }
        }),
        className: `bg-dark-secondary rounded-xl border border-dark-card p-4 mb-3 transition-all duration-200 hover:shadow-lg hover:shadow-dark-primary/10 ${priorityColors[task.priority] || ''}`
      };

  return (
    <motion.div
      {...animationProps}
      onMouseEnter={() => !shouldReduceMotion() && setIsHovered(true)}
      onMouseLeave={() => !shouldReduceMotion() && setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            onClick={handleToggleCompletion}
            className="mt-1 flex-shrink-0"
          >
            {task.status === 'completed' ? (
              <CheckCircle className="h-5 w-5 text-status-completed" />
            ) : (
              <Circle className="h-5 w-5 text-text-secondary" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold text-text-primary truncate ${task.status === 'completed' ? 'line-through text-text-secondary' : ''}`}>
                {task.title}
              </h3>
              <PriorityIcon className={`h-4 w-4 flex-shrink-0 ${task.priority === 'high' ? 'text-priority-high' : task.priority === 'medium' ? 'text-priority-medium' : 'text-priority-low'}`} />
            </div>

            {task.description && (
              <p className={`text-sm text-text-secondary mb-2 line-clamp-2 ${task.status === 'completed' ? 'line-through' : ''}`}>
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={task.priority}>{task.priority}</Badge>
              <Badge variant={task.status}>{task.status.replace('_', ' ')}</Badge>

              {task.dueDate && (
                <div className="flex items-center gap-1 text-xs text-text-secondary">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 ml-2">
          {(isHovered || task.status !== 'completed') && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="p-2"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task)}
                className="p-2 text-red-500 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;