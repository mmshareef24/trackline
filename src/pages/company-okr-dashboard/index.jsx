import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';


import DashboardHeader from './components/DashboardHeader';
import FilterSidebar from './components/FilterSidebar';
import ObjectiveCard from './components/ObjectiveCard';
import KeyResultCard from './components/KeyResultCard';
import ProgressCard from './components/ProgressCard';
import InitiativeCard from './components/InitiativeCard';
import BoardColumn from './components/BoardColumn';
import BulkActionToolbar from './components/BulkActionToolbar';

const CompanyOKRDashboard = () => {
  const { isCollapsed } = useSidebar();
  const [selectedQuarter, setSelectedQuarter] = useState('Q4');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);

  // Mock data for objectives
  const [objectives] = useState([
    {
      id: 'OBJ-001',
      title: 'Increase Customer Satisfaction Score',
      description: 'Improve overall customer satisfaction through enhanced support and product quality',
      status: 'On Track',
      priority: 'High',
      progress: 75,
      owner: 'Sarah Johnson',
      quarter: 4,
      keyResults: 3,
      type: 'objective'
    },
    {
      id: 'OBJ-002',
      title: 'Launch New Product Line',
      description: 'Successfully launch and market our new enterprise product suite',
      status: 'At Risk',
      priority: 'High',
      progress: 45,
      owner: 'Michael Chen',
      quarter: 4,
      keyResults: 5,
      type: 'objective'
    },
    {
      id: 'OBJ-003',
      title: 'Expand Engineering Team',
      description: 'Hire and onboard 15 new engineers across frontend, backend, and DevOps',
      status: 'Behind',
      priority: 'Medium',
      progress: 30,
      owner: 'Emily Rodriguez',
      quarter: 4,
      keyResults: 4,
      type: 'objective'
    },
    {
      id: 'OBJ-004',
      title: 'Improve System Performance',
      description: 'Reduce page load times and increase system reliability',
      status: 'Completed',
      priority: 'High',
      progress: 100,
      owner: 'David Kim',
      quarter: 4,
      keyResults: 3,
      type: 'objective'
    }
  ]);

  // Mock data for key results
  const [keyResults] = useState([
    {
      id: 'KR-001',
      title: 'Achieve 95% Customer Satisfaction Score',
      objectiveTitle: 'Increase Customer Satisfaction Score',
      type: 'percentage',
      current: 87,
      target: 95,
      progress: 75,
      owner: 'Sarah Johnson',
      lastUpdated: '2 hours ago',
    },
    {
      id: 'KR-002',
      title: 'Generate SAR 2M in New Revenue',
      objectiveTitle: 'Launch New Product Line',
      type: 'revenue',
      current: 850000,
      target: 2000000,
      progress: 43,
      owner: 'Michael Chen',
      lastUpdated: '1 day ago',
    },
    {
      id: 'KR-003',
      title: 'Reduce Support Tickets by 30%',
      objectiveTitle: 'Increase Customer Satisfaction Score',
      type: 'tickets',
      current: 120,
      target: 84,
      progress: 65,
      owner: 'Lisa Thompson',
      lastUpdated: '3 hours ago',
    },
    {
      id: 'KR-004',
      title: 'Hire 15 New Engineers',
      objectiveTitle: 'Expand Engineering Team',
      type: 'custom',
      current: 8,
      target: 15,
      progress: 53,
      owner: 'Emily Rodriguez',
      lastUpdated: '5 hours ago',
    }
  ]);

  // Mock data for initiatives
  const [initiatives] = useState([
    {
      id: 'INI-001',
      title: 'Customer Feedback Portal',
      description: 'Build a comprehensive portal for collecting and analyzing customer feedback',
      status: 'In Progress',
      type: 'Project',
      team: ['Sarah Johnson', 'Alex Wong', 'Maria Garcia'],
      linkedObjectives: 1,
      dueDate: 'Dec 15, 2024',
      timeRemaining: '2 weeks',
    },
    {
      id: 'INI-002',
      title: 'Product Marketing Campaign',
      description: 'Launch comprehensive marketing campaign for new product line',
      status: 'Planning',
      type: 'Campaign',
      team: ['Michael Chen', 'Jennifer Liu', 'Robert Taylor'],
      linkedObjectives: 1,
      dueDate: 'Jan 30, 2025',
      timeRemaining: '6 weeks',
    },
    {
      id: 'INI-003',
      title: 'Engineering Recruitment Drive',
      description: 'Accelerated hiring process for engineering positions',
      status: 'In Progress',
      type: 'Project',
      team: ['Emily Rodriguez', 'HR Team', 'Tech Leads'],
      linkedObjectives: 1,
      dueDate: 'Mar 31, 2025',
      timeRemaining: '12 weeks',
    },
    {
      id: 'INI-004',
      title: 'Performance Optimization',
      description: 'System-wide performance improvements and monitoring',
      status: 'Completed',
      type: 'Task',
      team: ['David Kim', 'DevOps Team'],
      linkedObjectives: 1,
      dueDate: 'Nov 30, 2024',
      timeRemaining: 'Completed',
    }
  ]);

  // Mock data for progress updates
  const [progressUpdates] = useState([
    {
      id: 'PRG-001',
      title: 'Customer Satisfaction Milestone Reached',
      description: 'Successfully achieved 87% customer satisfaction score, up from 82% last month. Key improvements in response time and issue resolution quality.',
      type: 'milestone',
      impact: 'High',
      confidence: 95,
      metrics: { change: 5, value: '87%' },
      linkedItem: 'Increase Customer Satisfaction Score',
      author: 'Sarah Johnson',
      timestamp: '2 hours ago',
    },
    {
      id: 'PRG-002',
      title: 'Product Launch Delayed',
      description: 'Encountered technical challenges with the new authentication system. Working with engineering team to resolve. Expected 2-week delay.',
      type: 'blocker',
      impact: 'Medium',
      confidence: 70,
      linkedItem: 'Launch New Product Line',
      author: 'Michael Chen',
      timestamp: '1 day ago',
    },
    {
      id: 'PRG-003',
      title: 'New Engineering Hires Onboarded',
      description: 'Successfully onboarded 3 new senior engineers this week. All team members are settling in well and contributing to current projects.',
      type: 'achievement',
      impact: 'Medium',
      confidence: 90,
      metrics: { change: 20, value: '8 hires' },
      linkedItem: 'Expand Engineering Team',
      author: 'Emily Rodriguez',
      timestamp: '3 days ago',
    },
    {
      id: 'PRG-004',
      title: 'Performance Targets Exceeded',
      description: 'System performance improvements have exceeded our targets. Page load times reduced by 40% and uptime improved to 99.9%.',
      type: 'achievement',
      impact: 'High',
      confidence: 100,
      metrics: { change: 40, value: '99.9%' },
      linkedItem: 'Improve System Performance',
      author: 'David Kim',
      timestamp: '1 week ago',
    }
  ]);

  const [filters, setFilters] = useState({
    quarter: 'all',
    status: 'all',
    priority: 'all',
    owner: 'all',
    department: 'all',
    progressMin: 0,
    progressMax: 100,
    search: '',
    showCompleted: true,
    showArchived: false
  });

  // Handle drag and drop
  const handleDragStart = (item, e) => {
    setDraggedItem(item);
    e?.dataTransfer?.setData('text/plain', JSON.stringify(item));
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (draggedData, targetColumn) => {
    console.log('Dropped item:', draggedData, 'to column:', targetColumn);
    // In a real app, this would update the item's status/column
  };

  // Handle card actions
  const handleCardEdit = (item) => {
    console.log('Edit item:', item);
    // In a real app, this would open an edit modal
  };

  const handleCardDelete = (itemId) => {
    console.log('Delete item:', itemId);
    // In a real app, this would delete the item
  };

  // Handle bulk actions
  const handleBulkAction = async (action, value, items) => {
    console.log('Bulk action:', action, value, items);
    // In a real app, this would perform the bulk operation
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  // Handle create new
  const handleCreateNew = (type) => {
    console.log('Create new:', type);
    // In a real app, this would open a creation modal
  };

  const handleAddNew = (columnType) => {
    console.log('Add new to column:', columnType);
    // In a real app, this would open a creation modal for that specific type
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className={`transition-all duration-300 pt-16 pb-20 md:pb-4 ${
        isCollapsed ? 'ml-0 md:ml-16' : 'ml-0 md:ml-60'
      }`}>
        <DashboardHeader
          onQuarterChange={setSelectedQuarter}
          onSearchChange={setSearchQuery}
          onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
          onCreateNew={handleCreateNew}
        />

        <div className="flex">
          {/* Filter Sidebar */}
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            onFiltersChange={setFilters}
          />

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Bulk Action Toolbar */}
            <BulkActionToolbar
              selectedItems={selectedItems}
              onBulkAction={handleBulkAction}
              onClearSelection={() => setSelectedItems([])}
            />

            {/* Board Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 sm:h-[calc(100vh-360px)] md:h-[calc(100vh-300px)] overflow-y-hidden">
              {/* Objectives Column */}
              <BoardColumn
                title="Objectives"
                items={objectives}
                icon="Target"
                color="bg-primary"
                onDrop={handleDrop}
                onCardEdit={handleCardEdit}
                onCardDelete={handleCardDelete}
                onAddNew={handleAddNew}
              >
                {objectives?.map((objective) => (
                  <ObjectiveCard
                    key={objective?.id}
                    objective={objective}
                    onEdit={handleCardEdit}
                    onDelete={handleCardDelete}
                    onDragStart={(e) => handleDragStart(objective, e)}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedItem?.id === objective?.id}
                  />
                ))}
              </BoardColumn>

              {/* Key Results Column */}
              <BoardColumn
                title="Key Results"
                items={keyResults}
                icon="BarChart3"
                color="bg-accent"
                onDrop={handleDrop}
                onCardEdit={handleCardEdit}
                onCardDelete={handleCardDelete}
                onAddNew={handleAddNew}
              >
                {keyResults?.map((keyResult) => (
                  <KeyResultCard
                    key={keyResult?.id}
                    keyResult={keyResult}
                    onEdit={handleCardEdit}
                    onDelete={handleCardDelete}
                    onDragStart={(e) => handleDragStart(keyResult, e)}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedItem?.id === keyResult?.id}
                  />
                ))}
              </BoardColumn>

              {/* Initiatives Column */}
              <BoardColumn
                title="Initiatives"
                items={initiatives}
                icon="Rocket"
                color="bg-warning"
                onDrop={handleDrop}
                onCardEdit={handleCardEdit}
                onCardDelete={handleCardDelete}
                onAddNew={handleAddNew}
              >
                {initiatives?.map((initiative) => (
                  <InitiativeCard
                    key={initiative?.id}
                    initiative={initiative}
                    onEdit={handleCardEdit}
                    onDelete={handleCardDelete}
                    onDragStart={(e) => handleDragStart(initiative, e)}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedItem?.id === initiative?.id}
                  />
                ))}
              </BoardColumn>

              {/* Progress Column */}
              <BoardColumn
                title="Progress"
                items={progressUpdates}
                icon="TrendingUp"
                color="bg-success"
                onDrop={handleDrop}
                onCardEdit={handleCardEdit}
                onCardDelete={handleCardDelete}
                onAddNew={handleAddNew}
              >
                {progressUpdates?.map((progress) => (
                  <ProgressCard
                    key={progress?.id}
                    progress={progress}
                    onEdit={handleCardEdit}
                    onDelete={handleCardDelete}
                    onDragStart={(e) => handleDragStart(progress, e)}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedItem?.id === progress?.id}
                  />
                ))}
              </BoardColumn>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyOKRDashboard;