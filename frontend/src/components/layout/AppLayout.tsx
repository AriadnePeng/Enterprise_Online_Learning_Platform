import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity, BarChart3, BookOpen, ChevronLeft, ChevronRight, Cog, Database,
  Eye, GraduationCap, LayoutDashboard, ListChecks, LogOut, Menu, Server,
  Table2, Users, X, Zap,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const menuGroups = [
  {
    label: '运营管理',
    items: [
      { path: '/', label: '数据全景', icon: LayoutDashboard },
      { path: '/visualization', label: '可视化大屏', icon: BarChart3 },
      { path: '/users', label: '学员管理', icon: Users },
      { path: '/courses', label: '课程管理', icon: BookOpen },
      { path: '/exams', label: '考试管理', icon: GraduationCap },
      { path: '/tasks', label: '培训任务', icon: ListChecks },
      { path: '/statistics', label: '统计报表', icon: Activity },
    ],
  },
  {
    label: '数据库展示',
    items: [
      { path: '/tables', label: '数据表管理', icon: Database },
      { path: '/views', label: '视图展示中心', icon: Eye },
      { path: '/procedures', label: '存储过程控制台', icon: Cog },
      { path: '/triggers', label: '触发器演示中心', icon: Zap },
    ],
  },
];

const menuItems = menuGroups.flatMap((group) => group.items);

const statsItems = [
  { label: '数据表', count: 16, icon: Table2, color: 'text-blue-400' },
  { label: '视图', count: 10, icon: Eye, color: 'text-emerald-400' },
  { label: '存储过程', count: 10, icon: Cog, color: 'text-amber-400' },
  { label: '触发器', count: 10, icon: Activity, color: 'text-rose-400' },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const currentPage = menuItems.find((item) => item.path === location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {mobileOpen && <button aria-label="关闭导航遮罩" className="fixed inset-0 z-30 bg-slate-950/55 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-950 text-white shadow-2xl transition-all duration-300 lg:static lg:translate-x-0 lg:shadow-none ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } ${collapsed ? 'lg:w-20' : 'lg:w-72'}`}>
        <div className="flex h-16 items-center border-b border-white/10 px-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600">
            <Server className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="ml-3 min-w-0">
              <h1 className="truncate text-sm font-bold">企业在线学习平台</h1>
              <p className="truncate text-[10px] text-slate-400">学习运营与数据库管理</p>
            </div>
          )}
          <button aria-label="关闭导航" className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden" onClick={() => setMobileOpen(false)}><X className="h-4 w-4" /></button>
          <button aria-label={collapsed ? '展开侧边栏' : '收起侧边栏'} className="ml-auto hidden rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:block" onClick={() => setCollapsed((value) => !value)}>
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {menuGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">{group.label}</p>}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      title={collapsed ? item.label : undefined}
                      onClick={() => {
                        setMobileOpen(false);
                        navigate(item.path);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        active ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/40' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      } ${collapsed ? 'justify-center' : ''}`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {active && !collapsed && <ChevronRight className="ml-auto h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {!collapsed && (
          <div className="border-t border-white/10 p-3">
            <div className="mb-3 grid grid-cols-4 gap-1.5">
              {statsItems.map((item) => {
                const Icon = item.icon;
                return <div key={item.label} className="rounded-lg bg-white/5 p-2 text-center"><Icon className={`mx-auto h-3.5 w-3.5 ${item.color}`} /><p className="mt-1 text-sm font-bold">{item.count}</p><p className="text-[9px] text-slate-500">{item.label}</p></div>;
              })}
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20 font-semibold text-blue-300">{user?.name.slice(0, 1)}</div>
              <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{user?.name}</p><p className="truncate text-[10px] text-slate-500">{user?.role}</p></div>
              <button title="退出登录" onClick={handleLogout} className="rounded-lg p-2 text-slate-500 hover:bg-white/10 hover:text-rose-300"><LogOut className="h-4 w-4" /></button>
            </div>
          </div>
        )}
        {collapsed && <button title="退出登录" onClick={handleLogout} className="mx-auto mb-4 rounded-xl p-3 text-slate-400 hover:bg-white/10 hover:text-rose-300"><LogOut className="h-5 w-5" /></button>}
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 flex-shrink-0 items-center border-b border-slate-200 bg-white px-4 sm:px-6">
          <button aria-label="打开导航" className="mr-3 rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden" onClick={() => setMobileOpen(true)}><Menu className="h-5 w-5" /></button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">{currentPage?.label ?? '企业在线学习平台'}</p>
            <p className="hidden text-[11px] text-slate-400 sm:block">数据库课设综合业务展示平台</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              API / Mock 服务就绪
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 lg:hidden">{user?.name.slice(0, 1)}</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
