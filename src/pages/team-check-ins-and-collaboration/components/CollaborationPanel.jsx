import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CollaborationPanel = ({ selectedCheckin, onAddComment, onMentionUser, onStartThread }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('comments');
  const [showMentions, setShowMentions] = useState(false);

  const teamMembers = [
  { id: 1, name: 'Sarah Johnson', username: 'sarah.j', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150' },
  { id: 2, name: 'Mike Chen', username: 'mike.c', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 3, name: 'Emily Davis', username: 'emily.d', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
  { id: 4, name: 'Alex Rodriguez', username: 'alex.r', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' }];


  const mockComments = [
  {
    id: 1,
    author: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150' },
    content: 'Great progress on the API integration! The performance improvements are really showing.',
    timestamp: '2 hours ago',
    replies: [
    {
      id: 11,
      author: { name: 'Mike Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
      content: 'Thanks! The caching layer made a huge difference.',
      timestamp: '1 hour ago'
    }]

  },
  {
    id: 2,
    author: { name: 'Emily Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
    content: 'Regarding the blocker with the third-party service - I had a similar issue last month. Happy to share the workaround I used.',
    timestamp: '4 hours ago',
    replies: []
  },
  {
    id: 3,
    author: { name: 'Alex Rodriguez', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
    content: 'The workload seems high this week. Do you need any support with the testing phase?',
    timestamp: '1 day ago',
    replies: []
  }];


  const mockActivity = [
  {
    id: 1,
    type: 'comment',
    user: 'Sarah Johnson',
    action: 'commented on check-in',
    timestamp: '2 hours ago',
    icon: 'MessageSquare'
  },
  {
    id: 2,
    type: 'approval',
    user: 'Team Lead',
    action: 'approved check-in',
    timestamp: '3 hours ago',
    icon: 'CheckCircle'
  },
  {
    id: 3,
    type: 'mention',
    user: 'Mike Chen',
    action: 'mentioned you in a comment',
    timestamp: '5 hours ago',
    icon: 'AtSign'
  },
  {
    id: 4,
    type: 'edit',
    user: 'You',
    action: 'updated check-in',
    timestamp: '1 day ago',
    icon: 'Edit'
  }];


  const handleSubmitComment = async (e) => {
    e?.preventDefault();
    if (!newComment?.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment({
        content: newComment,
        checkinId: selectedCheckin?.id,
        timestamp: new Date()?.toISOString()
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMention = (member) => {
    const mention = `@${member?.username} `;
    setNewComment((prev) => prev + mention);
    setShowMentions(false);
    onMentionUser(member);
  };

  const detectMentions = (text) => {
    return text?.includes('@');
  };

  if (!selectedCheckin) {
    return (
      <div className="h-full flex items-center justify-center bg-card border-l border-border p-6">
        <div className="text-center max-w-xs">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
            <Icon name="MessageSquare" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-base font-medium text-foreground mb-2">Select a Check-in</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Choose a check-in from the timeline to view comments and collaborate
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Collaboration</h2>
          <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'comments' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`
            }>

            Comments ({mockComments?.length})
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'activity' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`
            }>

            Activity
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'comments' ?
        <div className="p-4 space-y-4">
            {/* Comments List */}
            {mockComments?.map((comment) =>
          <div key={comment?.id} className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Image
                src={comment?.author?.avatar}
                alt={comment?.author?.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{comment?.author?.name}</span>
                      <span className="text-xs text-muted-foreground">{comment?.timestamp}</span>
                    </div>
                    <p className="text-sm text-foreground">{comment?.content}</p>
                    
                    {/* Comment Actions */}
                    <div className="flex items-center space-x-3 mt-2">
                      <button className="text-xs text-muted-foreground hover:text-foreground flex items-center space-x-1">
                        <Icon name="Heart" size={12} />
                        <span>Like</span>
                      </button>
                      <button
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center space-x-1"
                    onClick={() => onStartThread(comment?.id)}>

                        <Icon name="MessageSquare" size={12} />
                        <span>Reply</span>
                      </button>
                      <button className="text-xs text-muted-foreground hover:text-foreground flex items-center space-x-1">
                        <Icon name="Share" size={12} />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {comment?.replies && comment?.replies?.length > 0 &&
            <div className="ml-11 space-y-3 border-l-2 border-border pl-4">
                    {comment?.replies?.map((reply) =>
              <div key={reply?.id} className="flex items-start space-x-3">
                        <Image
                  src={reply?.author?.avatar}
                  alt={reply?.author?.name}
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0" />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-foreground">{reply?.author?.name}</span>
                            <span className="text-xs text-muted-foreground">{reply?.timestamp}</span>
                          </div>
                          <p className="text-sm text-foreground">{reply?.content}</p>
                        </div>
                      </div>
              )}
                  </div>
            }
              </div>
          )}
          </div> :

        <div className="p-4 space-y-3">
            {/* Activity List */}
            {mockActivity?.map((activity) =>
          <div key={activity?.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Icon name={activity?.icon} size={14} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{activity?.user}</span> {activity?.action}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity?.timestamp}</p>
                </div>
              </div>
          )}
          </div>
        }
      </div>
      {/* Comment Input */}
      {activeTab === 'comments' &&
      <div className="p-4 border-t border-border">
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <div className="relative">
              <textarea
              value={newComment}
              onChange={(e) => {
                setNewComment(e?.target?.value);
                if (detectMentions(e?.target?.value)) {
                  setShowMentions(true);
                }
              }}
              placeholder="Add a comment... Use @ to mention team members"
              className="w-full h-20 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none" />

              
              {/* Mentions Dropdown */}
              {showMentions &&
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-popover border border-border rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <div className="text-xs font-medium text-foreground mb-2">Mention someone</div>
                    {teamMembers?.map((member) =>
                <button
                  key={member?.id}
                  type="button"
                  onClick={() => handleMention(member)}
                  className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-muted text-left">

                        <Image
                    src={member?.avatar}
                    alt={member?.name}
                    className="w-6 h-6 rounded-full object-cover" />

                        <div>
                          <div className="text-sm font-medium text-foreground">{member?.name}</div>
                          <div className="text-xs text-muted-foreground">@{member?.username}</div>
                        </div>
                      </button>
                )}
                  </div>
                </div>
            }
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button type="button" variant="ghost" size="sm" iconName="Paperclip">
                  Attach
                </Button>
                <Button
                type="button"
                variant="ghost"
                size="sm"
                iconName="AtSign"
                onClick={() => setShowMentions(!showMentions)}>

                  Mention
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button
                type="submit"
                size="sm"
                loading={isSubmitting}
                disabled={!newComment?.trim()}
                iconName="Send"
                iconPosition="left">

                  Comment
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-2 text-xs text-muted-foreground">
            <Icon name="Info" size={12} className="inline mr-1" />
            Press Ctrl+Enter to submit quickly
          </div>
        </div>
      }
    </div>
  );

};

export default CollaborationPanel;