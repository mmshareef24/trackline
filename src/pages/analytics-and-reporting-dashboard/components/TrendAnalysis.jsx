import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';

const TrendAnalysis = ({ data, title, height = 350 }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry?.color }}
                ></div>
                <span className="text-sm text-foreground">{entry?.name}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{entry?.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getTrendDirection = () => {
    if (data?.length < 2) return null;
    const latest = data?.[data?.length - 1];
    const previous = data?.[data?.length - 2];
    const change = latest?.overall - previous?.overall;
    
    if (change > 0) return { direction: 'up', color: 'text-success', icon: 'TrendingUp' };
    if (change < 0) return { direction: 'down', color: 'text-error', icon: 'TrendingDown' };
    return { direction: 'stable', color: 'text-muted-foreground', icon: 'Minus' };
  };

  const trend = getTrendDirection();

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {trend && (
            <div className={`flex items-center space-x-2 mt-1 ${trend?.color}`}>
              <Icon name={trend?.icon} size={16} />
              <span className="text-sm font-medium">
                {trend?.direction === 'up' ? 'Trending Up' : 
                 trend?.direction === 'down' ? 'Trending Down' : 'Stable'}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Activity" size={20} className="text-muted-foreground" />
        </div>
      </div>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="overallGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-warning)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-warning)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="period" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="overall"
              stroke="var(--color-primary)"
              fillOpacity={1}
              fill="url(#overallGradient)"
              strokeWidth={2}
              name="Overall Progress"
            />
            <Area
              type="monotone"
              dataKey="onTrack"
              stroke="var(--color-success)"
              fillOpacity={1}
              fill="url(#targetGradient)"
              strokeWidth={2}
              name="On Track"
            />
            <Area
              type="monotone"
              dataKey="atRisk"
              stroke="var(--color-warning)"
              fillOpacity={1}
              fill="url(#riskGradient)"
              strokeWidth={2}
              name="At Risk"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {data?.[data?.length - 1]?.overall || 0}%
          </p>
          <p className="text-sm text-muted-foreground">Overall Progress</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-success">
            {data?.[data?.length - 1]?.onTrack || 0}%
          </p>
          <p className="text-sm text-muted-foreground">On Track</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-warning">
            {data?.[data?.length - 1]?.atRisk || 0}%
          </p>
          <p className="text-sm text-muted-foreground">At Risk</p>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysis;