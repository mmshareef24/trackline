import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import { useOrganization } from '../../contexts/OrganizationContext';
import { listUsers } from '../../services/userService';
import TeamMemberList from './components/TeamMemberList';
import CheckinTimeline from './components/CheckinTimeline';
import CheckinForm from './components/CheckinForm';
import CollaborationPanel from './components/CollaborationPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';


const TeamCheckinsAndCollaboration = () => {
  const { isCollapsed } = useSidebar();
  const { currentOrg } = useOrganization();
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [activeView, setActiveView] = useState('timeline'); // 'timeline', 'form', 'collaboration'
  const [teamMembers, setTeamMembers] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load real users
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const users = await listUsers();
        // Map users to team member format expected by UI
        const members = users.map(u => ({
          id: u.id,
          name: u.name,
          role: u.role, // Uses custom role name if available
          avatar: u.avatar,
          status: u.status,
          lastCheckin: 'Never',
          weeklyCheckins: 0,
          blockers: 0,
          hasUnreadCheckins: false,
          needsAttention: false
        }));
        setTeamMembers(members);
        setCheckins([]); // No backend for checkins yet
        if (members.length > 0) setSelectedMember(members[0]);
      } catch (e) {
        console.error('Failed to load team members:', e);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (currentOrg) loadData();
  }, [currentOrg]);

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
    setSelectedCheckin(null);
    setActiveView('timeline');
  };

  const handleCheckinSelect = (checkin) => {
    setSelectedCheckin(checkin);
    setActiveView('collaboration');
  };

  const handleSubmitCheckin = async (checkinData) => {
    try {
      const newCheckin = {
        id: checkins?.length + 1,
        author: selectedMember,
        weekOf: `Week of ${new Date(checkinData.weekOf)?.toLocaleDateString()}`,
        submittedAt: 'Just now',
        status: 'pending',
        priority: 'medium',
        summary: checkinData?.progressUpdate?.substring(0, 100) + '...',
        progressUpdate: checkinData?.progressUpdate,
        completedTasks: checkinData?.completedTasks?.split('\n')?.length,
        blockers: checkinData?.blockers ? checkinData?.blockers?.split('\n')?.length : 0,
        blockersList: checkinData?.blockers ? checkinData?.blockers?.split('\n') : [],
        nextWeekPriorities: checkinData?.nextWeekPriorities,
        comments: 0,
        mood: checkinData?.mood,
        workloadRating: checkinData?.workloadRating
      };

      setCheckins(prev => [newCheckin, ...prev]);
      setActiveView('timeline');
      
      // Update member's weekly checkins count
      setTeamMembers(prev => prev?.map(member => 
        member?.id === selectedMember?.id 
          ? { ...member, weeklyCheckins: member?.weeklyCheckins + 1, lastCheckin: 'Just now' }
          : member
      ));
    } catch (error) {
      console.error('Error submitting check-in:', error);
    }
  };

  const handleSaveDraft = (draftData) => {
    console.log('Saving draft:', draftData);
    // In a real app, this would save to localStorage or backend
  };

  const handleApproveCheckin = (checkinId) => {
    setCheckins(prev => prev?.map(checkin => 
      checkin?.id === checkinId 
        ? { ...checkin, status: 'approved' }
        : checkin
    ));
  };

  const handleCommentCheckin = (checkinId) => {
    const checkin = checkins?.find(c => c?.id === checkinId);
    if (checkin) {
      setSelectedCheckin(checkin);
      setActiveView('collaboration');
    }
  };

  const handleAddComment = async (commentData) => {
    console.log('Adding comment:', commentData);
    // In a real app, this would add the comment to the backend
  };

  const handleMentionUser = (user) => {
    console.log('Mentioning user:', user);
    // In a real app, this would trigger notifications
  };

  const handleStartThread = (commentId) => {
    console.log('Starting thread for comment:', commentId);
    // In a real app, this would create a threaded discussion
  };

  const filteredCheckins = selectedMember 
    ? checkins?.filter(checkin => checkin?.author?.id === selectedMember?.id)
    : checkins;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-0 md:ml-60 mt-16">
            <div className="h-screen flex items-center justify-center">
              <div className="text-center">
                <Icon name="Loader2" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading team check-ins...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className={`transition-all duration-300 pt-16 pb-20 md:pb-4 ${
        isCollapsed ? 'ml-0 md:ml-16' : 'ml-0 md:ml-60'
      }`}>
        {/* Page Header */}
        <div className="bg-card border-b border-border p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Team Check-ins & Collaboration</h1>
              <p className="text-muted-foreground mt-1">
                Manage weekly check-ins, track team progress, and facilitate collaboration
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 md:gap-3">
              <Button
                variant={activeView === 'timeline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('timeline')}
                iconName="Clock"
                iconPosition="left"
              >
                Timeline
              </Button>
              <Button
                variant={activeView === 'form' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('form')}
                iconName="Plus"
                iconPosition="left"
              >
                New Check-in
              </Button>
              <Button
                variant={activeView === 'collaboration' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('collaboration')}
                iconName="MessageSquare"
                iconPosition="left"
              >
                Collaborate
              </Button>
            </div>
          </div>
        </div>

        {/* Three-Panel Layout */}
        <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] relative">
          {/* Team Members Panel (20%) */}
          <div className={`
            md:w-1/5 md:min-w-[280px] bg-card border-r border-border
            ${activeView === 'mobile_members' ? 'absolute inset-0 z-20 w-full flex flex-col' : 'hidden md:flex md:flex-col'}
          `}>
            {activeView === 'mobile_members' && (
              <div className="p-4 border-b border-border flex items-center justify-between md:hidden">
                <h3 className="font-semibold text-foreground">Select Team Member</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setActiveView('timeline')}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
            )}
            <TeamMemberList
              teamMembers={teamMembers}
              selectedMember={selectedMember}
              onMemberSelect={(member) => {
                handleMemberSelect(member);
                // On mobile, close list after selection
                if (window.innerWidth < 768) setActiveView('timeline');
              }}
              onFilterChange={(filters) => console.log('Filter change:', filters)}
            />
          </div>

          {/* Main Content Panel (80%) */}
          <div className="flex-1 flex flex-col min-w-0 bg-background">
            {/* Mobile Member Selector Header */}
            <div className="md:hidden p-4 border-b border-border flex items-center justify-between bg-card">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {selectedMember ? selectedMember.name.charAt(0) : 'A'}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{selectedMember ? selectedMember.name : 'All Members'}</p>
                  <p className="text-xs text-muted-foreground">{selectedMember ? selectedMember.role : 'Team View'}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveView('mobile_members')}
              >
                Change
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeView === 'timeline' && (
                <CheckinTimeline
                  checkins={filteredCheckins}
                  selectedCheckin={selectedCheckin}
                  onCheckinSelect={handleCheckinSelect}
                  onApproveCheckin={handleApproveCheckin}
                  onCommentCheckin={handleCommentCheckin}
                />
              )}
              
              {activeView === 'form' && (
                <CheckinForm
                  selectedMember={selectedMember}
                  onSubmitCheckin={handleSubmitCheckin}
                  onSaveDraft={handleSaveDraft}
                  onCancel={() => setActiveView('timeline')}
                />
              )}
              
              {activeView === 'collaboration' && (
                <CollaborationPanel
                  selectedCheckin={selectedCheckin}
                  onAddComment={handleAddComment}
                  teamMembers={teamMembers}
                  onMentionUser={handleMentionUser}
                  onStartThread={handleStartThread}
                  onBack={() => setActiveView('timeline')}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamCheckinsAndCollaboration;