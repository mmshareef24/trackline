import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';

import Button from '../../components/ui/Button';
import ObjectivesList from './components/ObjectivesList';
import ObjectiveForm from './components/ObjectiveForm';
import ObjectiveDetails from './components/ObjectiveDetails';
import BulkActions from './components/BulkActions';

const ObjectiveCreationAndManagement = () => {
  const { isCollapsed } = useSidebar();
  const [objectives, setObjectives] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [selectedObjectives, setSelectedObjectives] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('split'); // 'split', 'list', 'details'

  // Mock data for objectives
  const mockObjectives = [
    {
      id: 1,
      title: "Increase Quarterly Revenue Growth",
      description: "Drive significant revenue growth through strategic initiatives, market expansion, and customer acquisition to achieve sustainable business growth targets for Q1 2025.",
      category: "Revenue Growth",
      priority: "high",
      status: "active",
      progress: 75,
      owner: "John Doe",
      team: "Sales",
      quarter: "Q1 2025",
      updatedAt: "2 days ago",
      createdAt: "2025-01-15",
      tags: ["revenue", "growth", "q1-priority"],
      keyResults: [
        {
          id: 101,
          title: "Achieve $2M in quarterly revenue",
          metricType: "currency",
          currentValue: 1500000,
          targetValue: 2000000,
          unit: "$",
          progress: 75
        },
        {
          id: 102,
          title: "Increase conversion rate to 15%",
          metricType: "percentage",
          currentValue: 12,
          targetValue: 15,
          unit: "%",
          progress: 80
        },
        {
          id: 103,
          title: "Acquire 500 new customers",
          metricType: "number",
          currentValue: 320,
          targetValue: 500,
          unit: " customers",
          progress: 64
        }
      ]
    },
    {
      id: 2,
      title: "Launch New Product Feature Suite",
      description: "Successfully develop, test, and launch comprehensive product features to enhance user experience and drive customer satisfaction metrics.",
      category: "Product Development",
      priority: "high",
      status: "active",
      progress: 45,
      owner: "Sarah Johnson",
      team: "Product",
      quarter: "Q1 2025",
      updatedAt: "1 day ago",
      createdAt: "2025-01-10",
      tags: ["product", "launch", "features"],
      keyResults: [
        {
          id: 201,
          title: "Complete feature development",
          metricType: "percentage",
          currentValue: 60,
          targetValue: 100,
          unit: "%",
          progress: 60
        },
        {
          id: 202,
          title: "Achieve 80% user adoption",
          metricType: "percentage",
          currentValue: 25,
          targetValue: 80,
          unit: "%",
          progress: 31
        }
      ]
    },
    {
      id: 3,
      title: "Improve Customer Success Metrics",
      description: "Enhance customer satisfaction, reduce churn rate, and improve overall customer success indicators through strategic support initiatives.",
      category: "Customer Success",
      priority: "medium",
      status: "active",
      progress: 60,
      owner: "Mike Chen",
      team: "Customer Success",
      quarter: "Q1 2025",
      updatedAt: "3 hours ago",
      createdAt: "2025-01-20",
      tags: ["customer", "success", "retention"],
      keyResults: [
        {
          id: 301,
          title: "Reduce customer churn to 5%",
          metricType: "percentage",
          currentValue: 8,
          targetValue: 5,
          unit: "%",
          progress: 60
        },
        {
          id: 302,
          title: "Increase NPS score to 70",
          metricType: "number",
          currentValue: 58,
          targetValue: 70,
          unit: " points",
          progress: 67
        }
      ]
    },
    {
      id: 4,
      title: "Expand Market Presence",
      description: "Strategic market expansion initiative to enter new geographical markets and establish strong brand presence in target regions.",
      category: "Market Expansion",
      priority: "medium",
      status: "draft",
      progress: 20,
      owner: "Emily Davis",
      team: "Marketing",
      quarter: "Q2 2025",
      updatedAt: "1 week ago",
      createdAt: "2025-01-05",
      tags: ["market", "expansion", "growth"],
      keyResults: [
        {
          id: 401,
          title: "Enter 3 new markets",
          metricType: "number",
          currentValue: 1,
          targetValue: 3,
          unit: " markets",
          progress: 33
        },
        {
          id: 402,
          title: "Establish 10 partnerships",
          metricType: "number",
          currentValue: 2,
          targetValue: 10,
          unit: " partnerships",
          progress: 20
        }
      ]
    },
    {
      id: 5,
      title: "Enhance Team Development",
      description: "Focus on team growth, skill development, and employee satisfaction to build a high-performing organization culture.",
      category: "Team Development",
      priority: "low",
      status: "completed",
      progress: 100,
      owner: "Alex Rodriguez",
      team: "HR",
      quarter: "Q4 2024",
      updatedAt: "2 weeks ago",
      createdAt: "2024-10-01",
      tags: ["team", "development", "hr"],
      keyResults: [
        {
          id: 501,
          title: "Complete training for 100% of team",
          metricType: "percentage",
          currentValue: 100,
          targetValue: 100,
          unit: "%",
          progress: 100
        },
        {
          id: 502,
          title: "Achieve 90% employee satisfaction",
          metricType: "percentage",
          currentValue: 92,
          targetValue: 90,
          unit: "%",
          progress: 100
        }
      ]
    },
    {
      id: 6,
      title: "Optimize Operational Excellence",
      description: "Streamline operations, improve efficiency metrics, and reduce operational costs while maintaining quality standards.",
      category: "Operational Excellence",
      priority: "medium",
      status: "archived",
      progress: 85,
      owner: "Lisa Wang",
      team: "Operations",
      quarter: "Q3 2024",
      updatedAt: "1 month ago",
      createdAt: "2024-07-01",
      tags: ["operations", "efficiency", "cost-reduction"],
      keyResults: [
        {
          id: 601,
          title: "Reduce operational costs by 15%",
          metricType: "percentage",
          currentValue: 12,
          targetValue: 15,
          unit: "%",
          progress: 80
        },
        {
          id: 602,
          title: "Improve process efficiency by 25%",
          metricType: "percentage",
          currentValue: 22,
          targetValue: 25,
          unit: "%",
          progress: 88
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading objectives
    const loadObjectives = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setObjectives(mockObjectives);
      setIsLoading(false);
    };

    loadObjectives();
  }, []);

  const handleSelectObjective = (objective) => {
    setSelectedObjective(objective);
    if (window.innerWidth < 1024) {
      setViewMode('details');
    }
  };

  const handleCreateNew = () => {
    setFormMode('create');
    setSelectedObjective(null);
    setIsFormOpen(true);
  };

  const handleEditObjective = (objective = selectedObjective) => {
    setFormMode('edit');
    setSelectedObjective(objective);
    setIsFormOpen(true);
  };

  const handleSaveObjective = (objectiveData) => {
    if (formMode === 'create') {
      const newObjective = {
        ...objectiveData,
        id: Date.now(),
        progress: 0,
        status: 'draft',
        createdAt: new Date()?.toISOString()?.split('T')?.[0],
        updatedAt: 'just now'
      };
      setObjectives(prev => [newObjective, ...prev]);
      setSelectedObjective(newObjective);
    } else {
      setObjectives(prev => prev?.map(obj => 
        obj?.id === selectedObjective?.id 
          ? { ...obj, ...objectiveData, updatedAt: 'just now' }
          : obj
      ));
      setSelectedObjective(prev => ({ ...prev, ...objectiveData, updatedAt: 'just now' }));
    }
    setIsFormOpen(false);
  };

  const handleBulkAction = (actionId, selectedIds) => {
    console.log('Bulk action:', actionId, 'for objectives:', selectedIds);
    
    switch (actionId) {
      case 'status_active':
        setObjectives(prev => prev?.map(obj => 
          selectedIds?.includes(obj?.id) ? { ...obj, status: 'active', updatedAt: 'just now' } : obj
        ));
        break;
      case 'status_draft':
        setObjectives(prev => prev?.map(obj => 
          selectedIds?.includes(obj?.id) ? { ...obj, status: 'draft', updatedAt: 'just now' } : obj
        ));
        break;
      case 'status_completed':
        setObjectives(prev => prev?.map(obj => 
          selectedIds?.includes(obj?.id) ? { ...obj, status: 'completed', progress: 100, updatedAt: 'just now' } : obj
        ));
        break;
      case 'status_archived':
        setObjectives(prev => prev?.map(obj => 
          selectedIds?.includes(obj?.id) ? { ...obj, status: 'archived', updatedAt: 'just now' } : obj
        ));
        break;
      case 'priority_high':
        setObjectives(prev => prev?.map(obj => 
          selectedIds?.includes(obj?.id) ? { ...obj, priority: 'high', updatedAt: 'just now' } : obj
        ));
        break;
      case 'priority_medium':
        setObjectives(prev => prev?.map(obj => 
          selectedIds?.includes(obj?.id) ? { ...obj, priority: 'medium', updatedAt: 'just now' } : obj
        ));
        break;
      case 'priority_low':
        setObjectives(prev => prev?.map(obj => 
          selectedIds?.includes(obj?.id) ? { ...obj, priority: 'low', updatedAt: 'just now' } : obj
        ));
        break;
      case 'export':
        // Simulate export
        const exportData = objectives?.filter(obj => selectedIds?.includes(obj?.id));
        console.log('Exporting objectives:', exportData);
        break;
      case 'duplicate':
        const duplicatedObjectives = objectives?.filter(obj => selectedIds?.includes(obj?.id))?.map(obj => ({
            ...obj,
            id: Date.now() + Math.random(),
            title: `${obj?.title} (Copy)`,
            status: 'draft',
            progress: 0,
            createdAt: new Date()?.toISOString()?.split('T')?.[0],
            updatedAt: 'just now'
          }));
        setObjectives(prev => [...duplicatedObjectives, ...prev]);
        break;
      case 'delete':
        setObjectives(prev => prev?.filter(obj => !selectedIds?.includes(obj?.id)));
        if (selectedObjective && selectedIds?.includes(selectedObjective?.id)) {
          setSelectedObjective(null);
        }
        break;
    }
    
    setSelectedObjectives([]);
  };

  const handleToggleSelection = (objectiveId) => {
    setSelectedObjectives(prev => 
      prev?.includes(objectiveId)
        ? prev?.filter(id => id !== objectiveId)
        : [...prev, objectiveId]
    );
  };

  const handleSelectAll = () => {
    if (selectedObjectives?.length === objectives?.length) {
      setSelectedObjectives([]);
    } else {
      setSelectedObjectives(objectives?.map(obj => obj?.id));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <div className="md:ml-60 pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading objectives...</p>
            </div>
          </div>
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
        <div className="h-screen flex">
          {/* Mobile View Toggle */}
          <div className="lg:hidden fixed top-20 right-4 z-30">
            <div className="flex bg-card border border-border rounded-lg p-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                iconName="List"
              />
              <Button
                variant={viewMode === 'details' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('details')}
                iconName="Eye"
                disabled={!selectedObjective}
              />
            </div>
          </div>

          {/* Desktop Split View / Mobile Conditional View */}
          <div className={`${
            viewMode === 'details' ? 'hidden lg:block' : 'block'
          } w-full lg:w-2/5 border-r border-border`}>
            <ObjectivesList
              objectives={objectives}
              onSelectObjective={handleSelectObjective}
              selectedObjectiveId={selectedObjective?.id}
              onCreateNew={handleCreateNew}
              selectedObjectives={selectedObjectives}
              onToggleSelection={handleToggleSelection}
              onSelectAll={handleSelectAll}
            />
          </div>

          <div className={`${
            viewMode === 'list' ? 'hidden lg:block' : 'block'
          } w-full lg:w-3/5`}>
            <ObjectiveDetails
              objective={selectedObjective}
              onEdit={handleEditObjective}
              onClose={() => {
                setSelectedObjective(null);
                if (window.innerWidth < 1024) {
                  setViewMode('list');
                }
              }}
            />
          </div>
        </div>
      </main>

      {/* Objective Form Modal */}
      <ObjectiveForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveObjective}
        objective={formMode === 'edit' ? selectedObjective : null}
        mode={formMode}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedObjectives={selectedObjectives}
        onBulkAction={handleBulkAction}
        onClearSelection={() => setSelectedObjectives([])}
      />

      {/* Mobile Bottom Padding */}
      <div className="h-20 md:hidden"></div>
    </div>
  );
};

export default ObjectiveCreationAndManagement;