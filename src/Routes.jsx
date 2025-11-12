import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import { SidebarProvider } from "./contexts/SidebarContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
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
import Login from './pages/Login';
import LoginNew from './pages/LoginNew';
import Logout from './pages/Logout';

const Routes = () => {
  const RequireAuth = ({ children }) => {
    const { user } = useAuth();
    // Allow access to login route without auth
    if (!user) {
      return <Login />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <ErrorBoundary>
      <AuthProvider>
        <SidebarProvider>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/login" element={<Login />} />
          <Route path="/login-new" element={<LoginNew />} />
          <Route path="/logout" element={<Logout />} />

          <Route path="/" element={<RequireAuth><AnalyticsAndReportingDashboard /></RequireAuth>} />
          <Route path="/user-and-permission-management" element={<RequireAuth><UserAndPermissionManagement /></RequireAuth>} />
          <Route path="/analytics-and-reporting-dashboard" element={<RequireAuth><AnalyticsAndReportingDashboard /></RequireAuth>} />
          <Route path="/progress-tracking-and-updates" element={<RequireAuth><ProgressTrackingAndUpdates /></RequireAuth>} />
          <Route path="/system-configuration-and-settings" element={<RequireAuth><SystemConfigurationAndSettings /></RequireAuth>} />
          <Route path="/timeline-and-milestone-management" element={<RequireAuth><TimelineAndMilestoneManagement /></RequireAuth>} />
          <Route path="/team-check-ins-and-collaboration" element={<RequireAuth><TeamCheckinsAndCollaboration /></RequireAuth>} />
          <Route path="/objective-creation-and-management" element={<RequireAuth><ObjectiveCreationAndManagement /></RequireAuth>} />
          <Route path="/company-okr-dashboard" element={<RequireAuth><CompanyOKRDashboard /></RequireAuth>} />
          <Route path="/balanced-scorecard" element={<RequireAuth><BalancedScorecard /></RequireAuth>} />
          <Route path="/all-pages" element={<RequireAuth><AllPages /></RequireAuth>} />
          <Route path="/more" element={<RequireAuth><AllPages /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
        </SidebarProvider>
      </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;