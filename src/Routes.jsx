import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import { SidebarProvider } from "./contexts/SidebarContext";
import NotFound from "./pages/NotFound";
import AllPages from "./pages/all-pages";
import UserAndPermissionManagement from './pages/user-and-permission-management';
import AnalyticsAndReportingDashboard from './pages/analytics-and-reporting-dashboard';
import ProgressTrackingAndUpdates from './pages/progress-tracking-and-updates';
import SystemConfigurationAndSettings from './pages/system-configuration-and-settings';
import TimelineAndMilestoneManagement from './pages/timeline-and-milestone-management';
import TeamCheckinsAndCollaboration from './pages/team-check-ins-and-collaboration';
import ObjectiveCreationAndManagement from './pages/objective-creation-and-management';
import CompanyOKRDashboard from './pages/company-okr-dashboard';
import BalancedScorecard from './pages/balanced-scorecard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <SidebarProvider>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AnalyticsAndReportingDashboard />} />
        <Route path="/user-and-permission-management" element={<UserAndPermissionManagement />} />
        <Route path="/analytics-and-reporting-dashboard" element={<AnalyticsAndReportingDashboard />} />
        <Route path="/progress-tracking-and-updates" element={<ProgressTrackingAndUpdates />} />
        <Route path="/system-configuration-and-settings" element={<SystemConfigurationAndSettings />} />
        <Route path="/timeline-and-milestone-management" element={<TimelineAndMilestoneManagement />} />
        <Route path="/team-check-ins-and-collaboration" element={<TeamCheckinsAndCollaboration />} />
        <Route path="/objective-creation-and-management" element={<ObjectiveCreationAndManagement />} />
        <Route path="/company-okr-dashboard" element={<CompanyOKRDashboard />} />
        <Route path="/balanced-scorecard" element={<BalancedScorecard />} />
        <Route path="/all-pages" element={<AllPages />} />
        <Route path="/more" element={<AllPages />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </SidebarProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;