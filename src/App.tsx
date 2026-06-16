import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import TableManagement from '@/pages/TableManagement';
import ViewCenter from '@/pages/ViewCenter';
import ProcedureCenter from '@/pages/ProcedureCenter';
import TriggerCenter from '@/pages/TriggerCenter';
import Login from '@/pages/Login';
import DataVisualization from '@/pages/DataVisualization';
import UserManagement from '@/pages/business/UserManagement';
import CourseManagement from '@/pages/business/CourseManagement';
import ExamManagement from '@/pages/business/ExamManagement';
import TaskManagement from '@/pages/business/TaskManagement';
import StatisticsReport from '@/pages/business/StatisticsReport';
import { useAuth } from '@/hooks/useAuth';

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-300">
        正在加载平台...
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <AppLayout />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/visualization" element={<DataVisualization />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/courses" element={<CourseManagement />} />
        <Route path="/exams" element={<ExamManagement />} />
        <Route path="/tasks" element={<TaskManagement />} />
        <Route path="/statistics" element={<StatisticsReport />} />
        <Route path="/tables" element={<TableManagement />} />
        <Route path="/views" element={<ViewCenter />} />
        <Route path="/procedures" element={<ProcedureCenter />} />
        <Route path="/triggers" element={<TriggerCenter />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
