import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  Database,
  Eye,
  Cog,
  Zap,
  Menu,
  X,
  ChevronRight,
  Server,
  Table2,
  FileCode,
  Activity
} from 'lucide-react';

const menuItems = [
  { path: '/', label: '数据全景', icon: LayoutDashboard },
  { path: '/tables', label: '数据表管理', icon: Database },
  { path: '/views', label: '视图展示中心', icon: Eye },
  { path: '/procedures', label: '存储过程控制台', icon: Cog },
  { path: '/triggers', label: '触发器演示中心', icon: Zap },
];

const statsItems = [
  { label: '数据表', count: 16, icon: Table2, color: 'text-blue-400' },
  { label: '视图', count: 10, icon: Eye, color: 'text-emerald-400' },
  { label: '存储过程', count: 10, icon: FileCode, color: 'text-amber-400' },
  { label: '触发器', count: 10, icon: Activity, color: 'text-rose-400' },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } bg-slate-900 text-white flex flex-col transition-all duration-300 flex-shrink-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-700">
          <Server className="w-6 h-6 text-blue-400 flex-shrink-0" />
          {sidebarOpen && (
            <div className="ml-3 overflow-hidden">
              <h1 className="text-sm font-bold truncate">企业在线学习平台</h1>
              <p className="text-[10px] text-slate-400 truncate">数据库展示系统</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-slate-400 hover:text-white"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
                {isActive && sidebarOpen && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* Stats Summary */}
        {sidebarOpen && (
          <div className="p-4 border-t border-slate-700">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              数据库对象统计
            </p>
            <div className="grid grid-cols-2 gap-2">
              {statsItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="bg-slate-800 rounded-lg p-2.5 flex items-center gap-2"
                  >
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <div>
                      <p className="text-lg font-bold leading-none">{item.count}</p>
                      <p className="text-[10px] text-slate-400">{item.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-center">
              共 {16 + 10 + 10 + 10} 个数据库对象
            </p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-700">数据库课设展示平台</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-400">
              {menuItems.find((m) => m.path === location.pathname)?.label || '页面'}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              后端服务运行中
            </div>
            <div className="text-xs text-slate-400">
              Spring Boot + MySQL 8.0
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
