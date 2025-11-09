import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProgressPanel = ({ objective, onProgressUpdate, onCommentAdd, onEvidenceUpload }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [newComment, setNewComment] = useState('');
  const [progressValues, setProgressValues] = useState({});

  if (!objective) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/10">
        <div className="text-center">
          <Icon name="Target" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Select an Objective</h3>
          <p className="text-muted-foreground">Choose an objective from the list to track progress</p>
        </div>
      </div>
    );
  }

  const handleProgressChange = (krId, value) => {
    setProgressValues(prev => ({ ...prev, [krId]: value }));
  };

  const handleProgressSave = (krId) => {
    const value = progressValues?.[krId];
    if (value !== undefined) {
      onProgressUpdate(objective?.id, krId, value);
      setProgressValues(prev => ({ ...prev, [krId]: undefined }));
    }
  };

  const handleCommentSubmit = (e) => {
    e?.preventDefault();
    if (newComment?.trim()) {
      onCommentAdd(objective?.id, newComment);
      setNewComment('');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track': return 'text-success bg-success/10 border-success/20';
      case 'at-risk': return 'text-warning bg-warning/10 border-warning/20';
      case 'behind': return 'text-error bg-error/10 border-error/20';
      case 'completed': return 'text-accent bg-accent/10 border-accent/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'keyresults', label: 'Key Results', icon: 'Target' },
    { id: 'comments', label: 'Comments', icon: 'MessageSquare' },
    { id: 'history', label: 'History', icon: 'Clock' }
  ];

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground mb-2">{objective?.title}</h1>
            <p className="text-muted-foreground mb-3">{objective?.description}</p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon name="User" size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{objective?.owner}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{objective?.quarter}</span>
              </div>
              <span className={`text-sm px-3 py-1 rounded-full border ${getStatusColor(objective?.status)}`}>
                {objective?.status?.replace('-', ' ')}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">{objective?.progress}%</div>
            <div className="text-sm text-muted-foreground">Overall Progress</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              objective?.progress >= 75 ? 'bg-success' :
              objective?.progress >= 50 ? 'bg-warning' :
              objective?.progress >= 25 ? 'bg-primary' : 'bg-error'
            }`}
            style={{ width: `${objective?.progress}%` }}
          />
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 px-6">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span className="font-medium">{tab?.label}</span>
            </button>
          ))}
        </nav>
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Target" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">Key Results</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{objective?.keyResults}</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Clock" size={16} className="text-warning" />
                  <span className="text-sm font-medium text-foreground">Days Left</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{objective?.daysLeft}</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="MessageSquare" size={16} className="text-accent" />
                  <span className="text-sm font-medium text-foreground">Comments</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{objective?.comments?.length || 0}</div>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium text-foreground mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {objective?.recentActivity?.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity?.description}</p>
                      <p className="text-xs text-muted-foreground">{activity?.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'keyresults' && (
          <div className="space-y-4">
            {objective?.keyResultsData?.map((kr) => (
              <div key={kr?.id} className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-foreground">{kr?.title}</h3>
                  <span className="text-sm text-muted-foreground">{kr?.type}</span>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium text-foreground">
                      {progressValues?.[kr?.id] !== undefined ? progressValues?.[kr?.id] : kr?.progress}%
                    </span>
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressValues?.[kr?.id] !== undefined ? progressValues?.[kr?.id] : kr?.progress}
                    onChange={(e) => handleProgressChange(kr?.id, parseInt(e?.target?.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  />
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      Current: {kr?.currentValue} / Target: {kr?.targetValue}
                    </span>
                    {progressValues?.[kr?.id] !== undefined && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleProgressSave(kr?.id)}
                        iconName="Save"
                        iconPosition="left"
                      >
                        Save
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Upload"
                    iconPosition="left"
                    onClick={() => onEvidenceUpload(kr?.id)}
                  >
                    Add Evidence
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MessageSquare"
                    iconPosition="left"
                  >
                    Comment
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-4">
            <form onSubmit={handleCommentSubmit} className="space-y-3">
              <Input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e?.target?.value)}
                className="w-full"
              />
              <Button
                type="submit"
                variant="default"
                size="sm"
                iconName="Send"
                iconPosition="left"
                disabled={!newComment?.trim()}
              >
                Post Comment
              </Button>
            </form>

            <div className="space-y-4">
              {objective?.comments?.map((comment) => (
                <div key={comment?.id} className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-foreground">
                        {comment?.author?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{comment?.author}</span>
                    <span className="text-xs text-muted-foreground">{comment?.timestamp}</span>
                  </div>
                  <p className="text-sm text-foreground">{comment?.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {objective?.history?.map((entry, index) => (
              <div key={index} className="flex items-start space-x-4 pb-4 border-b border-border last:border-b-0">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Clock" size={14} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{entry?.description}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-muted-foreground">{entry?.timestamp}</span>
                    <span className="text-xs text-muted-foreground">by {entry?.user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPanel;