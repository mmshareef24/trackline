import React from 'react';
import Icon from '../../../components/AppIcon';

const TeamPerformanceGrid = ({ teams }) => {
  const getPerformanceColor = (score) => {
    if (score >= 80) return 'text-success bg-success/10';
    if (score >= 60) return 'text-warning bg-warning/10';
    return 'text-error bg-error/10';
  };

  const getPerformanceIcon = (score) => {
    if (score >= 80) return 'TrendingUp';
    if (score >= 60) return 'Minus';
    return 'TrendingDown';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Team Performance</h3>
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Q4 2024</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams?.map((team) => (
          <div key={team?.id} className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {team?.name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{team?.name}</h4>
                  <p className="text-sm text-muted-foreground">{team?.members} members</p>
                </div>
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${getPerformanceColor(team?.performance)}`}>
                <Icon name={getPerformanceIcon(team?.performance)} size={14} />
                <span className="text-sm font-medium">{team?.performance}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Objectives</span>
                <span className="text-foreground">{team?.completedObjectives}/{team?.totalObjectives}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Key Results</span>
                <span className="text-foreground">{team?.completedKRs}/{team?.totalKRs}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Check-ins</span>
                <span className="text-foreground">{team?.checkInRate}%</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${team?.performance}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPerformanceGrid;