import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import TimelineHeader from './components/TimelineHeader';
import TimelineView from './components/TimelineView';
import MilestoneDetails from './components/MilestoneDetails';
import DependencyMap from './components/DependencyMap';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';



const TimelineAndMilestoneManagement = () => {
  const { isCollapsed } = useSidebar();
  const [currentView, setCurrentView] = useState('quarterly');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('all');
  const [selectedOwner, setSelectedOwner] = useState('all');
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');
  const [objectives, setObjectives] = useState([]);

  // Mock data for objectives and milestones
  useEffect(() => {
    const mockObjectives = [
      {
        id: 'obj-1',
        title: 'Increase Customer Acquisition Rate by 40%',
        description: 'Focus on digital marketing channels and referral programs to boost new customer acquisition',
        department: 'Marketing',
        priority: 'high',
        status: 'in-progress',
        progress: 65,
        owners: [
          { id: 'sarah-wilson', name: 'Sarah Wilson' },
          { id: 'mike-chen', name: 'Mike Chen' }
        ],
        dependencies: [],
        milestones: [
          {
            id: 'milestone-1',
            title: 'Launch Social Media Campaign',
            description: 'Deploy comprehensive social media advertising across all major platforms',
            quarter: 'Q1 2025',
            dueDate: '2025-03-15',
            status: 'completed',
            priority: 'high',
            assignee: 'sarah-wilson',
            assigneeName: 'Sarah Wilson',
            completionCriteria: 'Campaign live on Facebook, Instagram, LinkedIn, and Twitter with initial budget allocated',
            dependencies: [],
            comments: [
              {
                author: 'Sarah Wilson',
                content: 'Campaign is performing above expectations with 2.3x ROAS',
                timestamp: '2 days ago'
              }
            ]
          },
          {
            id: 'milestone-2',
            title: 'Implement Referral Program',
            description: 'Build and launch customer referral system with rewards',
            quarter: 'Q2 2025',
            dueDate: '2025-06-30',
            status: 'in-progress',
            priority: 'medium',
            assignee: 'mike-chen',
            assigneeName: 'Mike Chen',
            completionCriteria: 'Referral system integrated with CRM, reward structure defined, and beta testing completed',
            dependencies: ['milestone-1'],
            comments: []
          }
        ]
      },
      {
        id: 'obj-2',
        title: 'Reduce Customer Support Response Time to Under 2 Hours',
        description: 'Implement automated ticketing system and expand support team capacity',
        department: 'Customer Success',
        priority: 'high',
        status: 'in-progress',
        progress: 45,
        owners: [
          { id: 'emily-davis', name: 'Emily Davis' }
        ],
        dependencies: [],
        milestones: [
          {
            id: 'milestone-3',
            title: 'Deploy AI Chatbot',
            description: 'Implement AI-powered chatbot for initial customer inquiries',
            quarter: 'Q1 2025',
            dueDate: '2025-03-31',
            status: 'at-risk',
            priority: 'high',
            assignee: 'emily-davis',
            assigneeName: 'Emily Davis',
            completionCriteria: 'Chatbot handles 70% of common inquiries automatically',
            dependencies: [],
            comments: [
              {
                author: 'Emily Davis',
                content: 'Integration challenges with existing CRM system causing delays',
                timestamp: '1 day ago'
              }
            ]
          },
          {
            id: 'milestone-4',
            title: 'Hire Additional Support Staff',
            description: 'Recruit and onboard 3 new customer support representatives',
            quarter: 'Q2 2025',
            dueDate: '2025-05-15',
            status: 'pending',
            priority: 'medium',
            assignee: 'emily-davis',
            assigneeName: 'Emily Davis',
            completionCriteria: '3 new hires completed onboarding and handling tickets independently',
            dependencies: ['milestone-3'],
            comments: []
          }
        ]
      },
      {
        id: 'obj-3',
        title: 'Launch Mobile Application with 4.5+ App Store Rating',
        description: 'Develop and launch iOS and Android applications with focus on user experience',
        department: 'Product',
        priority: 'high',
        status: 'in-progress',
        progress: 78,
        owners: [
          { id: 'alex-johnson', name: 'Alex Johnson' },
          { id: 'john-doe', name: 'John Doe' }
        ],
        dependencies: ['obj-1'],
        milestones: [
          {
            id: 'milestone-5',
            title: 'Complete Beta Testing',
            description: 'Conduct comprehensive beta testing with 100+ users',
            quarter: 'Q1 2025',
            dueDate: '2025-03-20',
            status: 'completed',
            priority: 'high',
            assignee: 'alex-johnson',
            assigneeName: 'Alex Johnson',
            completionCriteria: 'Beta testing completed with 95% user satisfaction and major bugs resolved',
            dependencies: [],
            comments: [
              {
                author: 'Alex Johnson',
                content: 'Beta testing exceeded expectations with 4.7 average rating',
                timestamp: '5 days ago'
              }
            ]
          },
          {
            id: 'milestone-6',
            title: 'App Store Submission',
            description: 'Submit applications to Apple App Store and Google Play Store',
            quarter: 'Q2 2025',
            dueDate: '2025-04-15',
            status: 'in-progress',
            priority: 'high',
            assignee: 'john-doe',
            assigneeName: 'John Doe',
            completionCriteria: 'Apps approved and live on both app stores',
            dependencies: ['milestone-5'],
            comments: []
          }
        ]
      },
      {
        id: 'obj-4',
        title: 'Achieve 99.9% System Uptime',
        description: 'Implement robust infrastructure monitoring and disaster recovery procedures',
        department: 'Engineering',
        priority: 'medium',
        status: 'in-progress',
        progress: 82,
        owners: [
          { id: 'mike-chen', name: 'Mike Chen' }
        ],
        dependencies: [],
        milestones: [
          {
            id: 'milestone-7',
            title: 'Implement Monitoring System',
            description: 'Deploy comprehensive system monitoring and alerting',
            quarter: 'Q1 2025',
            dueDate: '2025-02-28',
            status: 'completed',
            priority: 'high',
            assignee: 'mike-chen',
            assigneeName: 'Mike Chen',
            completionCriteria: 'Monitoring covers all critical systems with automated alerting',
            dependencies: [],
            comments: []
          },
          {
            id: 'milestone-8',
            title: 'Setup Disaster Recovery',
            description: 'Establish disaster recovery procedures and backup systems',
            quarter: 'Q2 2025',
            dueDate: '2025-06-15',
            status: 'in-progress',
            priority: 'medium',
            assignee: 'mike-chen',
            assigneeName: 'Mike Chen',
            completionCriteria: 'DR procedures tested and documented with RTO < 4 hours',
            dependencies: ['milestone-7'],
            comments: []
          }
        ]
      },
      {
        id: 'obj-5',
        title: 'Expand to 3 New International Markets',
        description: 'Research and enter European and Asian markets with localized offerings',
        department: 'Business Development',
        priority: 'medium',
        status: 'pending',
        progress: 25,
        owners: [
          { id: 'sarah-wilson', name: 'Sarah Wilson' },
          { id: 'emily-davis', name: 'Emily Davis' }
        ],
        dependencies: ['obj-1', 'obj-3'],
        milestones: [
          {
            id: 'milestone-9',
            title: 'Market Research Completion',
            description: 'Complete comprehensive market analysis for target regions',
            quarter: 'Q2 2025',
            dueDate: '2025-05-30',
            status: 'pending',
            priority: 'medium',
            assignee: 'sarah-wilson',
            assigneeName: 'Sarah Wilson',
            completionCriteria: 'Market research reports completed for UK, Germany, and Japan',
            dependencies: [],
            comments: []
          },
          {
            id: 'milestone-10',
            title: 'Regulatory Compliance',
            description: 'Ensure compliance with local regulations in target markets',
            quarter: 'Q3 2025',
            dueDate: '2025-08-31',
            status: 'pending',
            priority: 'high',
            assignee: 'emily-davis',
            assigneeName: 'Emily Davis',
            completionCriteria: 'Legal compliance verified and documentation completed for all markets',
            dependencies: ['milestone-9'],
            comments: []
          }
        ]
      },
      {
        id: 'obj-6',
        title: 'Implement Advanced Analytics Dashboard',
        description: 'Build comprehensive analytics platform for data-driven decision making',
        department: 'Data Science',
        priority: 'low',
        status: 'in-progress',
        progress: 55,
        owners: [
          { id: 'alex-johnson', name: 'Alex Johnson' }
        ],
        dependencies: [],
        milestones: [
          {
            id: 'milestone-11',
            title: 'Data Pipeline Setup',
            description: 'Establish automated data collection and processing pipeline',
            quarter: 'Q1 2025',
            dueDate: '2025-03-10',
            status: 'completed',
            priority: 'medium',
            assignee: 'alex-johnson',
            assigneeName: 'Alex Johnson',
            completionCriteria: 'Data pipeline processes 1M+ events daily with 99% accuracy',
            dependencies: [],
            comments: []
          },
          {
            id: 'milestone-12',
            title: 'Dashboard Development',
            description: 'Build interactive dashboard with key business metrics',
            quarter: 'Q2 2025',
            dueDate: '2025-06-20',
            status: 'in-progress',
            priority: 'medium',
            assignee: 'alex-johnson',
            assigneeName: 'Alex Johnson',
            completionCriteria: 'Dashboard provides real-time insights with customizable views',
            dependencies: ['milestone-11'],
            comments: []
          }
        ]
      }
    ];

    setObjectives(mockObjectives);
  }, []);

  // Filter objectives based on search and filters
  const filteredObjectives = objectives?.filter(objective => {
    const matchesSearch = searchQuery === '' || 
      objective?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      objective?.department?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    
    const matchesQuarter = selectedQuarter === 'all' || 
      objective?.milestones?.some(milestone => milestone?.quarter === selectedQuarter);
    
    const matchesOwner = selectedOwner === 'all' || 
      objective?.owners?.some(owner => owner?.id === selectedOwner);

    return matchesSearch && matchesQuarter && matchesOwner;
  });

  const handleMilestoneUpdate = (objectiveId, milestoneId, updates) => {
    setObjectives(prev => prev?.map(obj => {
      if (obj?.id === objectiveId) {
        return {
          ...obj,
          milestones: obj?.milestones?.map(milestone => 
            milestone?.id === milestoneId ? { ...milestone, ...updates } : milestone
          )
        };
      }
      return obj;
    }));
  };

  const handleDependencyUpdate = (fromObjectiveId, toObjectiveId) => {
    setObjectives(prev => prev?.map(obj => {
      if (obj?.id === toObjectiveId) {
        const newDependencies = obj?.dependencies || [];
        if (!newDependencies?.includes(fromObjectiveId)) {
          return { ...obj, dependencies: [...newDependencies, fromObjectiveId] };
        }
      }
      return obj;
    }));
  };

  const handleExport = (format) => {
    console.log('Exporting timeline data in format:', format);
    // Implementation would generate and download the requested format
  };

  const handleBulkOperations = (data) => {
    console.log('Performing bulk operation:', data);
    // Implementation would apply bulk changes to selected milestones
  };

  const handleTemplateApply = (template) => {
    console.log('Applying template:', template);
    // Implementation would apply predefined milestone templates
  };

  const tabs = [
    { id: 'timeline', label: 'Timeline View', icon: 'Calendar' },
    { id: 'dependencies', label: 'Dependency Map', icon: 'GitBranch' },
    { id: 'actions', label: 'Quick Actions', icon: 'Zap' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className={`transition-all duration-300 pt-16 pb-20 md:pb-4 ${
        isCollapsed ? 'ml-0 md:ml-16' : 'ml-0 md:ml-60'
      }`}>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <TimelineHeader
            currentView={currentView}
            onViewChange={setCurrentView}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedQuarter={selectedQuarter}
            onQuarterChange={setSelectedQuarter}
            selectedOwner={selectedOwner}
            onOwnerChange={setSelectedOwner}
            onExport={handleExport}
            onBulkOperations={handleBulkOperations}
          />

          {/* Tab Navigation */}
          <div className="bg-card border border-border rounded-lg p-1">
            <div className="flex space-x-1">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 2xl:grid-cols-5 gap-6">
            {/* Primary Content - Expanded for better horizontal utilization */}
            <div className="2xl:col-span-4">
              {activeTab === 'timeline' && (
                <TimelineView
                  objectives={filteredObjectives}
                  currentView={currentView}
                  onMilestoneUpdate={handleMilestoneUpdate}
                  onDependencyChange={handleDependencyUpdate}
                />
              )}

              {activeTab === 'dependencies' && (
                <DependencyMap
                  objectives={filteredObjectives}
                  onDependencyUpdate={handleDependencyUpdate}
                />
              )}

              {activeTab === 'actions' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <QuickActions
                    onBulkUpdate={handleBulkOperations}
                    onExport={handleExport}
                    onTemplateApply={handleTemplateApply}
                  />
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="text-center text-muted-foreground">
                      <Icon name="BarChart3" size={48} className="mx-auto mb-4 opacity-50" />
                      <h3 className="font-medium text-foreground mb-2">Timeline Analytics</h3>
                      <p className="text-sm">Advanced analytics and insights coming soon</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Content - Collapsed by default on large screens */}
            <div className="2xl:col-span-1">
              <MilestoneDetails
                milestone={selectedMilestone}
                onUpdate={handleMilestoneUpdate}
                onClose={() => setSelectedMilestone(null)}
              />
            </div>
          </div>

          {/* Keyboard Shortcuts Help */}
          <div className="bg-muted/20 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Keyboard" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Keyboard Shortcuts</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted text-muted-foreground rounded border">←→</kbd>
                <span className="text-muted-foreground">Navigate timeline</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted text-muted-foreground rounded border">Space</kbd>
                <span className="text-muted-foreground">Select milestone</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted text-muted-foreground rounded border">Enter</kbd>
                <span className="text-muted-foreground">Quick edit</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted text-muted-foreground rounded border">Esc</kbd>
                <span className="text-muted-foreground">Close details</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TimelineAndMilestoneManagement;