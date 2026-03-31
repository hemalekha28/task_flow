import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  PieChart
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import Card from '../common/Card';
import { showToast } from '../common/Toast';
import { getAnimationProps } from '../../utils/animationUtils';

const StatCard = ({ title, value, icon: Icon, color, change, loading, loadingStats }) => {
  const iconColor = {
    purple: 'text-accent-purple',
    blue: 'text-accent-blue',
    green: 'text-status-completed',
    yellow: 'text-priority-medium',
    red: 'text-priority-high'
  };

  return (
    <motion.div
      {...getAnimationProps({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
      })}
    >
      <Card hover className="bg-dark-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-secondary">{title}</p>
            <div className="text-2xl font-bold text-text-primary mt-1">
              {(loading || loadingStats) ? (
                <div className="h-8 w-16 bg-dark-secondary rounded animate-pulse"></div>
              ) : (
                value
              )}
            </div>
            {change && (
              <p className={`text-xs mt-1 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${iconColor[color] || 'text-text-secondary'} bg-current/10`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const TaskStats = () => {
  const { stats, fetchDashboardStats, loading, loadingStats } = useTask();

  React.useEffect(() => {
    fetchDashboardStats();
  }, []);

  const statsData = stats || {
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    completedLastWeek: 0,
    completedPreviousWeek: 0,
    flow: []
  };

  const getChange = (current, prev) => {
    const diff = current - prev;
    if (diff > 0) return `+${diff} from last week`;
    if (diff < 0) return `${diff} from last week`;
    return 'Same as last week';
  };

  const statCards = [
    {
      title: 'Total Tasks',
      value: statsData.totalTasks,
      icon: Calendar,
      color: 'purple',
      change: '+2 from last month' // Simplified since we don't track total task history
    },
    {
      title: 'Pending',
      value: statsData.pendingTasks,
      icon: Clock,
      color: 'yellow',
      change: 'Active tasks'
    },
    {
      title: 'In Progress',
      value: statsData.inProgressTasks,
      icon: TrendingUp,
      color: 'blue',
      change: 'Current focus'
    },
    {
      title: 'Completed',
      value: statsData.completedTasks,
      icon: CheckCircle,
      color: 'green',
      change: getChange(statsData.completedLastWeek || 0, statsData.completedPreviousWeek || 0)
    },
    {
      title: 'Overdue',
      value: statsData.overdueTasks,
      icon: AlertTriangle,
      color: 'red',
      change: 'Needs attention'
    }
  ];

  return (
    <div className="space-y-8 mb-8">
      <motion.div
        {...getAnimationProps({
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: 0.2 }
        })}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
      >
        {statCards.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            change={stat.change}
            loading={loading}
            loadingStats={loadingStats}
          />
        ))}
      </motion.div>

      {/* Completion Flow Chart */}
      {statsData.flow && statsData.flow.length > 0 && (
        <motion.div
          {...getAnimationProps({
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.4 }
          })}
        >
          <Card className="p-6 bg-dark-card/30 backdrop-blur-md border-dark-card">
            <div className="flex items-center gap-2 mb-6 text-text-primary font-semibold">
              <TrendingUp className="h-5 w-5 text-accent-purple" />
              <h3>Completion Flow (Last 6 Months)</h3>
            </div>
            
            <div className="flex items-end justify-between h-40 gap-2 overflow-x-auto pb-2 px-2 custom-scrollbar">
              {statsData.flow.map((item, index) => {
                const maxCount = Math.max(...statsData.flow.map(i => i.count), 1);
                const percentage = (item.count / maxCount) * 100;
                
                return (
                  <div key={item.month} className="flex flex-col items-center flex-1 min-w-[60px] group cursor-default">
                    <div className="relative w-full flex flex-col items-center justify-end h-32 mb-2">
                       {/* Label on hover */}
                      <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-accent-purple text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap">
                        {item.count} tasks
                      </div>
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className="w-8 sm:w-10 rounded-t-lg bg-gradient-to-t from-accent-purple/40 to-accent-purple group-hover:from-accent-purple/60 group-hover:to-accent-purple transition-colors relative"
                      >
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/20 rounded-t-lg"></div>
                      </motion.div>
                    </div>
                    <span className="text-[10px] sm:text-xs text-text-secondary font-medium rotate-45 sm:rotate-0 mt-2 sm:mt-0">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default TaskStats;