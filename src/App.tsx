import { Routes, Route } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import TableManagement from '@/pages/TableManagement';
import ViewCenter from '@/pages/ViewCenter';
import ProcedureCenter from '@/pages/ProcedureCenter';
import TriggerCenter from '@/pages/TriggerCenter';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tables" element={<TableManagement />} />
        <Route path="/views" element={<ViewCenter />} />
        <Route path="/procedures" element={<ProcedureCenter />} />
        <Route path="/triggers" element={<TriggerCenter />} />
      </Route>
    </Routes>
  );
}
