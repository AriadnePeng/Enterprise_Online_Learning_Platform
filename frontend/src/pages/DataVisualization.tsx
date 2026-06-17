import { useEffect, useMemo, useState } from 'react';
import { Activity, BarChart3, CheckCircle2, PieChart as PieChartIcon, RefreshCw, Users } from 'lucide-react';
import { toast } from 'sonner';
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { api } from '@/services/api';
import type { BusinessRecord } from '@/types/business';
import { PageHeader } from '@/components/business/PageHeader';
import { MetricCard } from '@/components/business/MetricCard';
import { Button } from '@/components/ui/button';

const activityTrend = [
  { date: '06-08', active: 42, duration: 118 },
  { date: '06-09', active: 51, duration: 146 },
  { date: '06-10', active: 48, duration: 139 },
  { date: '06-11', active: 63, duration: 182 },
  { date: '06-12', active: 58, duration: 171 },
  { date: '06-13', active: 72, duration: 226 },
  { date: '06-14', active: 68, duration: 210 },
];

const COLORS = ['#2563eb', '#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e'];

export default function DataVisualization() {
  const [categories, setCategories] = useState<BusinessRecord[]>([]);
  const [scores, setScores] = useState<BusinessRecord[]>([]);
  const [progress, setProgress] = useState<BusinessRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoryRows, scoreRows, progressRows] = await Promise.all([
        api.view.getCourseCategoryStats(),
        api.view.getExamScoreSummary(),
        api.view.getTaskProgress(),
      ]);
      setCategories(categoryRows);
      setScores(scoreRows);
      setProgress(progressRows);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '可视化数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const passData = useMemo(() => {
    const passed = scores.filter((row) => row.pass_result === '及格').length;
    return [{ name: '及格', value: passed }, { name: '不及格', value: Math.max(scores.length - passed, 0) }];
  }, [scores]);
  const completionRate = progress.length ? Math.round(progress.reduce((sum, row) => sum + Number(row.completion_rate ?? 0), 0) / progress.length) : 0;
  const categoryData = categories.map((row) => ({ name: String(row.category_name), count: Number(row.course_count) }));
  const passRate = scores.length ? Math.round(passData[0].value / scores.length * 100) : 0;

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <PageHeader
        eyebrow="数据驾驶舱"
        title="学习运营可视化大屏"
        description="聚合学员活跃、考试成绩、课程供给和培训任务进度，辅助管理者快速识别趋势与风险。"
        actions={<Button variant="outline" disabled={loading} onClick={() => void loadData()}><RefreshCw className={loading ? 'animate-spin' : ''} />刷新数据</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="今日活跃学员" value="68" hint="较昨日 +17.2%" icon={Users} />
        <MetricCard label="考试及格率" value={`${passRate}%`} hint={`${scores.length} 份已批阅成绩`} icon={CheckCircle2} tone="emerald" />
        <MetricCard label="课程分类" value={categories.length} hint="课程知识领域" icon={BarChart3} tone="violet" />
        <MetricCard label="任务完成率" value={`${completionRate}%`} hint={`${progress.length} 项培训任务`} icon={Activity} tone="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <section className="db-card p-5 xl:col-span-3">
          <div className="mb-5"><h2 className="flex items-center gap-2 font-semibold text-slate-800"><Activity className="h-5 w-5 text-blue-600" />学员活跃度趋势</h2><p className="mt-1 text-xs text-slate-400">近 7 日活跃人数与学习时长</p></div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityTrend} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }} />
                <Legend />
                <Line type="monotone" dataKey="active" name="活跃人数" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="duration" name="学习时长(小时)" stroke="#0ea5e9" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="db-card p-5 xl:col-span-2">
          <div className="mb-5"><h2 className="flex items-center gap-2 font-semibold text-slate-800"><PieChartIcon className="h-5 w-5 text-emerald-600" />考试及格构成</h2><p className="mt-1 text-xs text-slate-400">已批阅答卷结果分布</p></div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={passData} dataKey="value" nameKey="name" cx="50%" cy="48%" innerRadius={70} outerRadius={105} paddingAngle={4}>
                  <Cell fill="#10b981" /><Cell fill="#f43f5e" />
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }} />
                <Legend verticalAlign="bottom" />
                <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-900 text-3xl font-bold">{passRate}%</text>
                <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-400 text-xs">总体及格率</text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="db-card p-5 xl:col-span-3">
          <div className="mb-5"><h2 className="flex items-center gap-2 font-semibold text-slate-800"><BarChart3 className="h-5 w-5 text-violet-600" />课程分类分布</h2><p className="mt-1 text-xs text-slate-400">各知识领域课程数量</p></div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }} />
                <Bar dataKey="count" name="课程数" radius={[8, 8, 0, 0]}>
                  {categoryData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="db-card p-5 xl:col-span-2">
          <div className="mb-5"><h2 className="flex items-center gap-2 font-semibold text-slate-800"><CheckCircle2 className="h-5 w-5 text-amber-600" />培训任务完成率</h2><p className="mt-1 text-xs text-slate-400">全部任务平均完成进度</p></div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="52%" innerRadius="58%" outerRadius="92%" barSize={22} data={[{ name: '完成率', value: completionRate, fill: '#f59e0b' }]} startAngle={210} endAngle={-30}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" background={{ fill: '#f1f5f9' }} cornerRadius={12} />
                <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-900 text-4xl font-bold">{completionRate}%</text>
                <text x="50%" y="59%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-400 text-xs">任务平均完成率</text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}

