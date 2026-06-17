import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { BookOpenCheck, Database, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(username, password);
      toast.success('登录成功');
      const from = (location.state as { from?: string } | null)?.from ?? '/';
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '登录失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.3),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_30%)]" />
      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
        <section className="hidden text-white lg:block">
          <div className="mb-8 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
            <div className="rounded-xl bg-blue-500 p-2.5"><BookOpenCheck className="h-6 w-6" /></div>
            <div>
              <p className="font-semibold">企业在线学习平台</p>
              <p className="text-xs text-slate-400">Learning Operations Console</p>
            </div>
          </div>
          <h1 className="max-w-2xl text-5xl font-bold leading-[1.14] tracking-tight">
            让培训数据从
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">分散记录变成清晰决策</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
            统一管理学员、课程、考试与培训任务，并通过数据库视图和统计报表实时掌握组织学习成效。
          </p>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
            {[
              { icon: Database, label: '业务数据一体化' },
              { icon: ShieldCheck, label: '权限与审计' },
              { icon: BookOpenCheck, label: '学习全流程' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 backdrop-blur">
                <Icon className="mb-3 h-5 w-5 text-blue-400" />
                {label}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white p-7 shadow-2xl shadow-blue-950/40 sm:p-9">
          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white lg:hidden">
              <BookOpenCheck className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-blue-600">管理控制台</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">欢迎回来</h2>
            <p className="mt-2 text-sm text-slate-500">使用管理员账号进入企业学习管理平台</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">账号</Label>
              <div className="relative">
                <UserRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input id="username" value={username} onChange={(event) => setUsername(event.target.value)} className="pl-10" autoComplete="username" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="pl-10" autoComplete="current-password" />
              </div>
            </div>
            <Button type="submit" className="h-11 w-full" disabled={submitting}>
              {submitting ? '正在登录...' : '登录平台'}
            </Button>
          </form>

          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
            演示账号：<strong className="text-slate-700">admin</strong>
            <span className="mx-2 text-slate-300">|</span>
            密码：<strong className="text-slate-700">123456</strong>
          </div>
        </section>
      </div>
    </div>
  );
}

