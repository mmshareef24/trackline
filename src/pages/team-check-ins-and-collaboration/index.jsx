import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import TeamMemberList from './components/TeamMemberList';
import CheckinTimeline from './components/CheckinTimeline';
import CheckinForm from './components/CheckinForm';
import CollaborationPanel from './components/CollaborationPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';


const TeamCheckinsAndCollaboration = () => {
  const { isCollapsed } = useSidebar();
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [activeView, setActiveView] = useState('timeline'); // 'timeline', 'form', 'collaboration'
  const [teamMembers, setTeamMembers] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const initializeData = () => {
      const mockTeamMembers = [
        {
          id: 1,
          name: 'Sarah Johnson',
          role: 'Senior Frontend Developer',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          status: 'active',
          lastCheckin: '2 days ago',
          weeklyCheckins: 3,
          blockers: 1,
          hasUnreadCheckins: true,
          needsAttention: false
        },
        {
          id: 2,
          name: 'Mike Chen',
          role: 'Backend Developer',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          status: 'busy',
          lastCheckin: '1 day ago',
          weeklyCheckins: 2,
          blockers: 2,
          hasUnreadCheckins: false,
          needsAttention: true
        },
        {
          id: 3,
          name: 'Emily Davis',
          role: 'Product Manager',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
          status: 'active',
          lastCheckin: '3 hours ago',
          weeklyCheckins: 4,
          blockers: 0,
          hasUnreadCheckins: true,
          needsAttention: false
        },
        {
          id: 4,
          name: 'Alex Rodriguez',
          role: 'DevOps Engineer',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          status: 'away',
          lastCheckin: '5 days ago',
          weeklyCheckins: 1,
          blockers: 0,
          hasUnreadCheckins: false,
          needsAttention: true
        },
        {
          id: 5,
          name: 'Lisa Wang',
          role: 'UX Designer',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
          status: 'active',
          lastCheckin: '1 day ago',
          weeklyCheckins: 3,
          blockers: 1,
          hasUnreadCheckins: false,
          needsAttention: false
        },
        {
          id: 6,
          name: 'David Kim',
          role: 'QA Engineer',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
          status: 'active',
          lastCheckin: '4 hours ago',
          weeklyCheckins: 2,
          blockers: 3,
          hasUnreadCheckins: true,
          needsAttention: true
        }
      ];

      const mockCheckins = [
        {
          id: 1,
          author: mockTeamMembers?.[0],
          weekOf: 'Week of July 29, 2025',
          submittedAt: '2 hours ago',
          status: 'pending',
          priority: 'high',
          summary: 'Completed API integration for user authentication module. Facing some challenges with third-party service rate limits.',
          progressUpdate: `This week I successfully completed the user authentication API integration, which was a major milestone for our Q3 objectives. The implementation includes OAuth 2.0 support and multi-factor authentication.\n\nKey achievements:\n- Integrated with Auth0 for secure authentication\n- Implemented JWT token management\n- Added password reset functionality\n- Created comprehensive unit tests with 95% coverage`,
          completedTasks: 8,
          blockers: 1,
          blockersList: ['Third-party API rate limiting causing timeout issues during peak hours'],
          nextWeekPriorities: 'Focus on optimizing API calls and implementing caching layer to resolve rate limiting issues. Begin work on user profile management features.',
          comments: 3,
          mood: 'good',
          workloadRating: 4
        },
        {
          id: 2,
          author: mockTeamMembers?.[1],
          weekOf: 'Week of July 29, 2025',
          submittedAt: '4 hours ago',
          status: 'approved',
          priority: 'medium',
          summary: 'Database optimization completed. Working on microservices architecture migration.',
          progressUpdate: `Focused on backend infrastructure improvements this week. The database optimization project is now complete and we're seeing significant performance improvements.\n\nCompleted work:\n- Database query optimization reduced response time by 40%\n- Implemented connection pooling\n- Set up database monitoring and alerting\n- Started microservices migration planning`,
          completedTasks: 6,
          blockers: 2,
          blockersList: [
            'Legacy code dependencies making microservices migration complex','Need approval for additional cloud infrastructure costs'
          ],
          nextWeekPriorities: 'Continue microservices migration, starting with user service. Coordinate with DevOps team for deployment pipeline setup.',comments: 1,mood: 'neutral',
          workloadRating: 5
        },
        {
          id: 3,
          author: mockTeamMembers?.[2],
          weekOf: 'Week of July 29, 2025',submittedAt: '1 day ago',status: 'approved',priority: 'low',summary: 'Product roadmap finalized for Q4. User research sessions completed successfully.',
          progressUpdate: `Great week for product planning and user research. We've finalized the Q4 roadmap and gathered valuable insights from our user research sessions.\n\nKey accomplishments:\n- Conducted 12 user interviews\n- Analyzed user feedback and identified top 3 pain points\n- Created detailed user personas\n- Finalized Q4 product roadmap with stakeholder approval`,
          completedTasks: 10,
          blockers: 0,
          blockersList: [],
          nextWeekPriorities: 'Begin wireframing for new features identified in user research. Coordinate with design team for UI/UX improvements.',
          comments: 5,
          mood: 'great',
          workloadRating: 3
        },
        {
          id: 4,
          author: mockTeamMembers?.[3],
          weekOf: 'Week of July 22, 2025',
          submittedAt: '5 days ago',
          status: 'needs_review',
          priority: 'high',
          summary: 'CI/CD pipeline improvements and security audit completion.',
          progressUpdate: `Focused on infrastructure security and deployment automation this week. Completed the quarterly security audit and implemented several CI/CD improvements.\n\nCompleted tasks:\n- Security audit identified and fixed 8 vulnerabilities\n- Automated deployment pipeline for staging environment\n- Implemented infrastructure as code using Terraform\n- Set up monitoring and alerting for production systems`,
          completedTasks: 7,
          blockers: 0,
          blockersList: [],
          nextWeekPriorities: 'Roll out automated deployment to production environment. Begin work on disaster recovery procedures.',
          comments: 2,
          mood: 'good',
          workloadRating: 4
        },
        {
          id: 5,
          author: mockTeamMembers?.[4],
          weekOf: 'Week of July 29, 2025',
          submittedAt: '1 day ago',
          status: 'pending',
          priority: 'medium',
          summary: 'User interface redesign for mobile app completed. Accessibility improvements implemented.',
          progressUpdate: `Completed the mobile app UI redesign this week with a focus on accessibility and user experience improvements. The new design has been well-received in initial testing.\n\nDesign achievements:\n- Redesigned 15 mobile screens with improved accessibility\n- Implemented WCAG 2.1 AA compliance\n- Created interactive prototypes for user testing\n- Collaborated with development team on implementation feasibility`,
          completedTasks: 9,
          blockers: 1,
          blockersList: ['Waiting for approval on new color palette from brand team'],
          nextWeekPriorities: 'Finalize design system documentation and begin handoff to development team. Start work on desktop version updates.',
          comments: 4,
          mood: 'great',
          workloadRating: 3
        },
        {
          id: 6,
          author: mockTeamMembers?.[5],
          weekOf: 'Week of July 29, 2025',
          submittedAt: '4 hours ago',
          status: 'pending',
          priority: 'high',
          summary: 'Critical bug fixes and test automation improvements. Found several issues in production.',
          progressUpdate: `Busy week with critical bug fixes and expanding our test automation coverage. Identified and resolved several production issues that were affecting user experience.\n\nQA activities:\n- Fixed 12 critical bugs in production\n- Expanded automated test coverage to 85%\n- Implemented performance testing for API endpoints\n- Created comprehensive regression test suite`,
          completedTasks: 11,
          blockers: 3,
          blockersList: [
            'Production environment access issues delaying bug verification',
            'Need additional testing devices for mobile compatibility',
            'Waiting for test data refresh in staging environment'
          ],
          nextWeekPriorities: 'Continue expanding test automation coverage. Focus on mobile testing and performance optimization validation.',
          comments: 2,
          mood: 'challenging',
          workloadRating: 5
        }
      ];

      setTeamMembers(mockTeamMembers);
      setCheckins(mockCheckins);
      setSelectedMember(mockTeamMembers?.[0]);
      setIsLoading(false);
    };

    initializeData();
  }, []);

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Team Check-ins & Collaboration</h1>
              <p className="text-muted-foreground mt-1">
                Manage weekly check-ins, track team progress, and facilitate collaboration
              </p>
            </div>
            
            <div className="flex space-x-3">
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
        <div className="flex h-[calc(100vh-8rem)]">
          {/* Team Members Panel (20%) */}
          <div className="w-1/5 min-w-[280px]">
            <TeamMemberList
              teamMembers={teamMembers}
              selectedMember={selectedMember}
              onMemberSelect={handleMemberSelect}
              onFilterChange={(filters) => console.log('Filter change:', filters)}
            />
          </div>

          {/* Main Content Panel (80%) - Expanded to fill the space */}
          <div className="flex-1">
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
                onMentionUser={handleMentionUser}
                onStartThread={handleStartThread}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamCheckinsAndCollaboration;