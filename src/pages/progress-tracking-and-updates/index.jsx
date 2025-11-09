import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import ObjectivesList from './components/ObjectivesList';
import ProgressPanel from './components/ProgressPanel';
import QuickStatsBar from './components/QuickStatsBar';
import BulkUpdateModal from './components/BulkUpdateModal';
import EvidenceUploadModal from './components/EvidenceUploadModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ProgressTrackingAndUpdates = () => {
  const { isCollapsed } = useSidebar();
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedKRForEvidence, setSelectedKRForEvidence] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all'
  });

  // Mock data for objectives
  const [objectives, setObjectives] = useState([
    {
      id: 1,
      title: "Increase Customer Satisfaction Score",
      description: "Improve overall customer satisfaction through enhanced support and product quality initiatives.",
      owner: "Sarah Johnson",
      quarter: "Q4 2024",
      status: "on-track",
      priority: "high",
      progress: 75,
      keyResults: 4,
      daysLeft: 45,
      lastUpdated: "2 hours ago",
      keyResultsData: [
        {
          id: 101,
          title: "Achieve NPS score of 70+",
          type: "Percentage",
          progress: 80,
          currentValue: 68,
          targetValue: 70
        },
        {
          id: 102,
          title: "Reduce support ticket resolution time to under 4 hours",
          type: "Time",
          progress: 65,
          currentValue: 5.2,
          targetValue: 4
        },
        {
          id: 103,
          title: "Implement customer feedback system",
          type: "Binary",
          progress: 90,
          currentValue: 1,
          targetValue: 1
        },
        {
          id: 104,
          title: "Train 100% of support staff on new protocols",
          type: "Percentage",
          progress: 70,
          currentValue: 70,
          targetValue: 100
        }
      ],
      comments: [
        {
          id: 1,
          author: "Sarah Johnson",
          content: "Great progress on the NPS score! We\'re almost at our target.",
          timestamp: "2 hours ago"
        },
        {
          id: 2,
          author: "Mike Chen",
          content: "The new feedback system is getting positive responses from customers.",
          timestamp: "1 day ago"
        }
      ],
      recentActivity: [
        {
          description: "NPS score updated to 68 (+3 from last week)",
          timestamp: "2 hours ago",
          user: "Sarah Johnson"
        },
        {
          description: "Customer feedback system deployed to production",
          timestamp: "3 days ago",
          user: "Dev Team"
        }
      ],
      history: [
        {
          description: "Progress updated from 70% to 75%",
          timestamp: "2 hours ago",
          user: "Sarah Johnson"
        },
        {
          description: "Status changed from \'at-risk\' to \'on-track\'",
          timestamp: "1 week ago",
          user: "Sarah Johnson"
        }
      ]
    },
    {
      id: 2,
      title: "Launch New Product Feature",
      description: "Successfully launch the AI-powered recommendation engine to improve user engagement.",
      owner: "Alex Rodriguez",
      quarter: "Q4 2024",
      status: "at-risk",
      priority: "high",
      progress: 45,
      keyResults: 3,
      daysLeft: 30,
      lastUpdated: "5 hours ago",
      keyResultsData: [
        {
          id: 201,
          title: "Complete feature development",
          type: "Percentage",
          progress: 60,
          currentValue: 60,
          targetValue: 100
        },
        {
          id: 202,
          title: "Achieve 80% user adoption within 30 days",
          type: "Percentage",
          progress: 0,
          currentValue: 0,
          targetValue: 80
        },
        {
          id: 203,
          title: "Increase user engagement by 25%",
          type: "Percentage",
          progress: 15,
          currentValue: 15,
          targetValue: 25
        }
      ],
      comments: [
        {
          id: 1,
          author: "Alex Rodriguez",
          content: "Development is behind schedule due to technical challenges with the ML model.",
          timestamp: "5 hours ago"
        }
      ],
      recentActivity: [
        {
          description: "Development progress updated to 60%",
          timestamp: "5 hours ago",
          user: "Alex Rodriguez"
        }
      ],
      history: [
        {
          description: "Status changed to \'at-risk\' due to development delays",
          timestamp: "5 hours ago",
          user: "Alex Rodriguez"
        }
      ]
    },
    {
      id: 3,
      title: "Expand Market Presence",
      description: "Enter two new geographical markets and establish local partnerships.",
      owner: "Emma Davis",
      quarter: "Q4 2024",
      status: "behind",
      priority: "medium",
      progress: 30,
      keyResults: 5,
      daysLeft: 60,
      lastUpdated: "1 day ago",
      keyResultsData: [
        {
          id: 301,
          title: "Establish partnerships in 2 new markets",
          type: "Count",
          progress: 50,
          currentValue: 1,
          targetValue: 2
        },
        {
          id: 302,
          title: "Achieve $500K revenue from new markets",
          type: "Revenue",
          progress: 20,
          currentValue: 100000,
          targetValue: 500000
        }
      ],
      comments: [],
      recentActivity: [
        {
          description: "First partnership established in European market",
          timestamp: "1 day ago",
          user: "Emma Davis"
        }
      ],
      history: [
        {
          description: "Partnership milestone achieved",
          timestamp: "1 day ago",
          user: "Emma Davis"
        }
      ]
    },
    {
      id: 4,
      title: "Improve Team Productivity",
      description: "Implement new tools and processes to increase team efficiency by 20%.",
      owner: "David Kim",
      quarter: "Q4 2024",
      status: "completed",
      priority: "low",
      progress: 100,
      keyResults: 3,
      daysLeft: 90,
      lastUpdated: "3 days ago",
      keyResultsData: [
        {
          id: 401,
          title: "Deploy new project management tool",
          type: "Binary",
          progress: 100,
          currentValue: 1,
          targetValue: 1
        },
        {
          id: 402,
          title: "Reduce average task completion time by 20%",
          type: "Percentage",
          progress: 100,
          currentValue: 25,
          targetValue: 20
        }
      ],
      comments: [
        {
          id: 1,
          author: "David Kim",
          content: "All objectives completed successfully! Team productivity has increased by 25%.",
          timestamp: "3 days ago"
        }
      ],
      recentActivity: [
        {
          description: "Objective marked as completed",
          timestamp: "3 days ago",
          user: "David Kim"
        }
      ],
      history: [
        {
          description: "Progress updated to 100% - objective completed",
          timestamp: "3 days ago",
          user: "David Kim"
        }
      ]
    },
    {
      id: 5,
      title: "Enhance Security Infrastructure",
      description: "Strengthen cybersecurity measures and achieve SOC 2 compliance.",
      owner: "Lisa Wang",
      quarter: "Q4 2024",
      status: "on-track",
      priority: "high",
      progress: 85,
      keyResults: 4,
      daysLeft: 25,
      lastUpdated: "6 hours ago",
      keyResultsData: [
        {
          id: 501,
          title: "Complete SOC 2 audit",
          type: "Binary",
          progress: 90,
          currentValue: 0.9,
          targetValue: 1
        },
        {
          id: 502,
          title: "Implement multi-factor authentication",
          type: "Percentage",
          progress: 100,
          currentValue: 100,
          targetValue: 100
        }
      ],
      comments: [],
      recentActivity: [
        {
          description: "SOC 2 audit 90% complete",
          timestamp: "6 hours ago",
          user: "Lisa Wang"
        }
      ],
      history: [
        {
          description: "MFA implementation completed",
          timestamp: "1 week ago",
          user: "Lisa Wang"
        }
      ]
    }
  ]);

  // Set initial selected objective
  useEffect(() => {
    if (objectives?.length > 0 && !selectedObjective) {
      setSelectedObjective(objectives?.[0]);
    }
  }, [objectives, selectedObjective]);

  const handleObjectiveSelect = (objective) => {
    setSelectedObjective(objective);
  };

  const handleProgressUpdate = (objectiveId, krId, newProgress) => {
    setObjectives(prev => prev?.map(obj => {
      if (obj?.id === objectiveId) {
        const updatedKRs = obj?.keyResultsData?.map(kr => 
          kr?.id === krId ? { ...kr, progress: newProgress } : kr
        );
        const avgProgress = Math.round(
          updatedKRs?.reduce((sum, kr) => sum + kr?.progress, 0) / updatedKRs?.length
        );
        return {
          ...obj,
          keyResultsData: updatedKRs,
          progress: avgProgress,
          lastUpdated: "Just now"
        };
      }
      return obj;
    }));

    // Update selected objective if it's the one being updated
    if (selectedObjective?.id === objectiveId) {
      const updatedObjective = objectives?.find(obj => obj?.id === objectiveId);
      if (updatedObjective) {
        setSelectedObjective({
          ...updatedObjective,
          keyResultsData: updatedObjective?.keyResultsData?.map(kr => 
            kr?.id === krId ? { ...kr, progress: newProgress } : kr
          )
        });
      }
    }
  };

  const handleCommentAdd = (objectiveId, comment) => {
    const newComment = {
      id: Date.now(),
      author: "Current User",
      content: comment,
      timestamp: "Just now"
    };

    setObjectives(prev => prev?.map(obj => 
      obj?.id === objectiveId 
        ? { ...obj, comments: [newComment, ...(obj?.comments || [])] }
        : obj
    ));

    if (selectedObjective?.id === objectiveId) {
      setSelectedObjective(prev => ({
        ...prev,
        comments: [newComment, ...(prev?.comments || [])]
      }));
    }
  };

  const handleBulkUpdate = (selectedObjectiveIds) => {
    setShowBulkModal(true);
  };

  const handleBulkUpdateSubmit = (updateData) => {
    setObjectives(prev => prev?.map(obj => {
      if (updateData?.objectiveIds?.includes(obj?.id)) {
        switch (updateData?.type) {
          case 'progress':
            return { ...obj, progress: updateData?.value, lastUpdated: "Just now" };
          case 'status':
            return { ...obj, status: updateData?.value, lastUpdated: "Just now" };
          case 'comment':
            const newComment = {
              id: Date.now(),
              author: "Current User",
              content: updateData?.value,
              timestamp: "Just now"
            };
            return { 
              ...obj, 
              comments: [newComment, ...(obj?.comments || [])],
              lastUpdated: "Just now"
            };
          default:
            return obj;
        }
      }
      return obj;
    }));
  };

  const handleEvidenceUpload = (krId) => {
    setSelectedKRForEvidence(krId);
    setShowEvidenceModal(true);
  };

  const handleEvidenceUploadSubmit = (evidenceData) => {
    console.log('Evidence uploaded:', evidenceData);
    // In a real app, this would upload to a server
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className={`transition-all duration-300 pt-16 pb-20 md:pb-4 ${
        isCollapsed ? 'ml-0 md:ml-16' : 'ml-0 md:ml-60'
      }`}>
        {/* Quick Stats Bar */}
        <QuickStatsBar objectives={objectives} />

        {/* Main Content */}
        <div className="flex h-[calc(100vh-140px)]">
          {/* Objectives List - 30% width */}
          <div className="w-full md:w-[30%] border-r border-border">
            <ObjectivesList
              objectives={objectives}
              selectedObjective={selectedObjective}
              onObjectiveSelect={handleObjectiveSelect}
              onBulkUpdate={handleBulkUpdate}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Progress Panel - 70% width */}
          <div className="hidden md:block w-[70%]">
            <ProgressPanel
              objective={selectedObjective}
              onProgressUpdate={handleProgressUpdate}
              onCommentAdd={handleCommentAdd}
              onEvidenceUpload={handleEvidenceUpload}
            />
          </div>
        </div>

        {/* Mobile Progress Panel */}
        {selectedObjective && (
          <div className="md:hidden">
            <div className="p-4 border-t border-border bg-card">
              <Button
                variant="outline"
                fullWidth
                iconName="ChevronUp"
                iconPosition="left"
                onClick={() => {
                  // In a real app, this would open a modal or slide-up panel
                  console.log('Open mobile progress panel');
                }}
              >
                View Progress Details
              </Button>
            </div>
          </div>
        )}

        {/* Floating Action Button - Mobile */}
        <div className="fixed bottom-20 right-4 md:hidden">
          <Button
            variant="default"
            size="icon"
            className="w-14 h-14 rounded-full shadow-lg"
            onClick={() => setShowBulkModal(true)}
          >
            <Icon name="Edit" size={24} />
          </Button>
        </div>
      </main>

      {/* Modals */}
      <BulkUpdateModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        selectedObjectives={[]} // This would come from ObjectivesList component
        objectives={objectives}
        onBulkUpdate={handleBulkUpdateSubmit}
      />

      <EvidenceUploadModal
        isOpen={showEvidenceModal}
        onClose={() => setShowEvidenceModal(false)}
        keyResultId={selectedKRForEvidence}
        onEvidenceUpload={handleEvidenceUploadSubmit}
      />

      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-4 left-4 hidden lg:block">
        <div className="bg-card border border-border rounded-lg p-3 shadow-sm">
          <div className="text-xs text-muted-foreground space-y-1">
            <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Tab</kbd> Navigate fields</div>
            <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+U</kbd> Bulk update</div>
            <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+E</kbd> Add evidence</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTrackingAndUpdates;