import React from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Step = ({ icon, title, desc, actions }) => (
  <div className="border border-border rounded-lg p-4 bg-card">
    <div className="flex items-start gap-3">
      <div className="mt-1"><Icon name={icon} /></div>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
        {actions && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  </div>
);

const TrainingGuide = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20 px-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Icon name="GraduationCap" /> Training Guide
          </h1>
          <p className="text-muted-foreground mt-1">A step-by-step guide to get your team productive with JASCO Insight.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Step
            icon="User"
            title="Sign In and Profile"
            desc="Sign in to access protected dashboards. Update your profile and confirm your role."
            actions={<Button variant="outline" size="sm" onClick={() => (window.location.href='/login')}>Go to Login</Button>}
          />
          <Step
            icon="BarChart3"
            title="Balanced Scorecard"
            desc="Review KPIs across perspectives. Drill down to modules and export CSV for sharing."
            actions={<Button variant="outline" size="sm" onClick={() => (window.location.href='/balanced-scorecard')}>Open Scorecard</Button>}
          />
          <Step
            icon="Layers"
            title="Module Pages"
            desc="Navigate Production, Project, Finance, Sales, and Supply Chain modules to manage objectives and metrics."
            actions={(
              <>
                <Button variant="outline" size="sm" onClick={() => (window.location.href='/production-module')}>Production</Button>
                <Button variant="outline" size="sm" onClick={() => (window.location.href='/project-module')}>Project</Button>
                <Button variant="outline" size="sm" onClick={() => (window.location.href='/finance-module')}>Finance</Button>
                <Button variant="outline" size="sm" onClick={() => (window.location.href='/sales-module')}>Sales</Button>
                <Button variant="outline" size="sm" onClick={() => (window.location.href='/supply-chain-module')}>Supply Chain</Button>
              </>
            )}
          />
          <Step
            icon="Target"
            title="Create Objectives"
            desc="Define objectives, set targets, and track progress. Use priorities and status to focus work."
            actions={<Button variant="outline" size="sm" onClick={() => (window.location.href='/objective-creation-and-management')}>Objective Management</Button>}
          />
          <Step
            icon="Sparkles"
            title="Use AI Assistant"
            desc="Ask questions about KPIs, workflows, and best practices. Get step-by-step guidance."
            actions={<Button variant="outline" size="sm" onClick={() => (window.location.href='/ai-assistant')}>Open AI Assistant</Button>}
          />
          <Step
            icon="BookOpen"
            title="Browse Knowledge Base"
            desc="Find articles on navigation, drill-downs, exports, and more."
            actions={<Button variant="outline" size="sm" onClick={() => (window.location.href='/knowledge-base')}>Open Knowledge Base</Button>}
          />
        </div>
      </main>
    </div>
  );
};

export default TrainingGuide;