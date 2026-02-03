import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import { SidebarProvider } from "./contexts/SidebarContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { OrganizationProvider } from "./contexts/OrganizationContext";
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
import Logout from './pages/Logout';
import ResetPassword from './pages/ResetPassword';
import ProductionModule from './pages/production-module';
import ProjectModule from './pages/project-module';
import FinanceModule from './pages/finance-module';
import SalesModule from './pages/sales-module';
import SupplyChainModule from './pages/supply-chain-module';
import HRModule from './pages/hr-module';
import ITModule from './pages/it-module';
import ExecutiveDashboard from './pages/executive-dashboard';
import AIAssistant from './pages/ai-assistant';
import KnowledgeBase from './pages/knowledge-base';
import TrainingGuide from './pages/training-guide';
import Diagnostic from './pages/Diagnostic';

const Routes = () => {
  const RequireAuth = ({ children }) => {
    const { user } = useAuth();
    // Allow access to login route without auth
    if (!user) {
      return <Login />;
    }
    return children;
  };

  const basePath = import.meta.env.VITE_BASE_PATH || "/";

  return (
    <BrowserRouter basename={basePath}>
      <ErrorBoundary>
      <AuthProvider>
        <OrganizationProvider>
        <SidebarProvider>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/login" element={<Login />} />
          {/* Removed demo login-new route for go-live */}
          <Route path="/logout" element={<Logout />} />
          <Route path="/reset-password" element={<ResetPassword />} />

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
          <Route path="/executive-dashboard" element={<RequireAuth><ExecutiveDashboard /></RequireAuth>} />
          <Route path="/ai-assistant" element={<RequireAuth><AIAssistant /></RequireAuth>} />
          <Route path="/knowledge-base" element={<RequireAuth><KnowledgeBase /></RequireAuth>} />
          <Route path="/training-guide" element={<RequireAuth><TrainingGuide /></RequireAuth>} />
          <Route path="/production-module" element={<RequireAuth><ProductionModule /></RequireAuth>} />
          <Route path="/project-module" element={<RequireAuth><ProjectModule /></RequireAuth>} />
          <Route path="/finance-module" element={<RequireAuth><FinanceModule /></RequireAuth>} />
          <Route path="/sales-module" element={<RequireAuth><SalesModule /></RequireAuth>} />
          <Route path="/supply-chain-module" element={<RequireAuth><SupplyChainModule /></RequireAuth>} />
          <Route path="/hr-module" element={<RequireAuth><HRModule /></RequireAuth>} />
          <Route path="/it-module" element={<RequireAuth><ITModule /></RequireAuth>} />
          <Route path="/all-pages" element={<RequireAuth><AllPages /></RequireAuth>} />
          <Route path="/more" element={<RequireAuth><AllPages /></RequireAuth>} />
          <Route path="/diagnostic" element={<Diagnostic />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
        </SidebarProvider>
        </OrganizationProvider>
      </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;