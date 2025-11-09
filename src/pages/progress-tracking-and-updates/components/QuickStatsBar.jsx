import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStatsBar = ({ objectives }) => {
  const totalObjectives = objectives?.length;
  const onTrackCount = objectives?.filter(obj => obj?.status === 'on-track')?.length;
  const atRiskCount = objectives?.filter(obj => obj?.status === 'at-risk')?.length;
  const behindCount = objectives?.filter(obj => obj?.status === 'behind')?.length;
  const completedCount = objectives?.filter(obj => obj?.status === 'completed')?.length;
  
  const averageProgress = totalObjectives > 0 
    ? Math.round(objectives?.reduce((sum, obj) => sum + obj?.progress, 0) / totalObjectives)
    : 0;

  const overdueCount = objectives?.filter(obj => obj?.daysLeft < 0)?.length;
  const dueSoonCount = objectives?.filter(obj => obj?.daysLeft >= 0 && obj?.daysLeft <= 7)?.length;

  const stats = [
    {
      label: 'Total Objectives',
      value: totalObjectives,
      icon: 'Target',
      color: 'text-foreground',
      bgColor: 'bg-muted/30'
    },
    {
      label: 'Average Progress',
      value: `${averageProgress}%`,
      icon: 'TrendingUp',
      color: averageProgress >= 75 ? 'text-success' : averageProgress >= 50 ? 'text-warning' : 'text-error',
      bgColor: averageProgress >= 75 ? 'bg-success/10' : averageProgress >= 50 ? 'bg-warning/10' : 'bg-error/10'
    },
    {
      label: 'On Track',
      value: onTrackCount,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'At Risk',
      value: atRiskCount,
      icon: 'AlertTriangle',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Behind',
      value: behindCount,
      icon: 'XCircle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      label: 'Completed',
      value: completedCount,
      icon: 'CheckCircle2',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'Due Soon',
      value: dueSoonCount,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Overdue',
      value: overdueCount,
      icon: 'AlertCircle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    }
  ];

  return (
    <div className="bg-card border-b border-border p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {stats?.map((stat, index) => (
          <div
            key={index}
            className={`${stat?.bgColor} p-3 rounded-lg border border-border/50`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Icon name={stat?.icon} size={16} className={stat?.color} />
              <span className="text-xs font-medium text-muted-foreground truncate">
                {stat?.label}
              </span>
            </div>
            <div className={`text-lg font-bold ${stat?.color}`}>
              {stat?.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStatsBar;