import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, Download, FileSpreadsheet, ShieldAlert, TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';
import type { BusinessRecord } from '@/types/business';
import { PageHeader } from '@/components/business/PageHeader';
import { MetricCard } from '@/components/business/MetricCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { exportToCsv, exportToExcel } from '@/utils/export';

function GenericTable({ rows }: { rows: BusinessRecord[] }) {
  if (!rows.length) return <div className="py-20 text-center text-sm text-slate-400">暂无符合条件的数据</div>;
  const headers = Object.keys(rows[0]);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[950px] text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500"><tr>{headers.map((header) => <th key={header} className="px-4 py-3">{header}</th>)}</tr></thead>
        <tbody className="divide-y">{rows.map((row, index) => <tr key={index} className="hover:bg-slate-50/80">{headers.map((header) => <td key={header} className="px-4 py-3 text-slate-600">{String(row[header] ?? '-')}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export default function StatisticsReport() {
  const [stats, setStats] = useState<BusinessRecord[]>([]);
  const [anomalies, setAnomalies] = useState<BusinessRecord[]>([]);
  const [risk, setRisk] = useState('全部');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [statRows, anomalyRows] = await Promise.all([
          api.view.getLearningExamStats(),
          api.view.getEmployeeAnomalies(),
        ]);
        setStats(statRows);
        setAnomalies(anomalyRows);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : '统计报表加载失败');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const filteredAnomalies = useMemo(() => anomalies.filter((row) => risk === '全部' || row.risk_level === risk), [anomalies, risk]);
  const metricValue = (name: string) => stats.find((row) => row.metric === name)?.value ?? 0;
  const highRiskCount = anomalies.filter((row) => row.risk_level === '高危').length;

  const exportAnomalies = async (format: 'csv' | 'excel') => {
    try {
      const rows = await api.procedure.exportAnomalyEmployees({ p_risk_level: risk === '全部' ? undefined : risk });
      if (format === 'csv') exportToCsv(rows, '异常员工报表');
      else exportToExcel(rows, '异常员工报表');
      toast.success('异常员工报表已生成');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '报表导出失败');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="统计分析报表"
        description="汇总组织学习与考试核心指标，识别异常员工并导出用于后续跟进。"
        actions={<><Button variant="outline" onClick={() => exportToCsv(stats, '全体学员学习考试统计')}><Download />导出统计</Button><Button onClick={() => void exportAnomalies('excel')}><FileSpreadsheet />导出异常员工</Button></>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="学员总数" value={String(metricValue('学员总数'))} hint="纳入统计范围" icon={Users} />
        <MetricCard label="学习活跃率" value={`${metricValue('学习活跃率')}%`} hint="最近周期活跃学员" icon={TrendingUp} tone="emerald" />
        <MetricCard label="考试及格率" value={`${metricValue('考试及格率')}%`} hint="全部考试人次" icon={BarChart3} tone="violet" />
        <MetricCard label="高危员工" value={highRiskCount} hint="需要优先干预" icon={ShieldAlert} tone="rose" />
      </div>

      <Tabs defaultValue="overview" className="db-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList><TabsTrigger value="overview"><BarChart3 />全体统计</TabsTrigger><TabsTrigger value="anomalies"><AlertTriangle />异常员工</TabsTrigger></TabsList>
          <div className="flex items-center gap-2">
            <Select value={risk} onValueChange={setRisk}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="全部">全部风险</SelectItem><SelectItem value="高危">高危</SelectItem><SelectItem value="中危">中危</SelectItem><SelectItem value="低危">低危</SelectItem></SelectContent></Select>
            <Button variant="outline" size="sm" onClick={() => void exportAnomalies('csv')}><Download />CSV</Button>
          </div>
        </div>
        <TabsContent value="overview" className="m-0">
          {loading ? <div className="py-20 text-center text-sm text-slate-400">正在生成统计报表...</div> : (
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((row) => (
                <div key={String(row.metric)} className="rounded-xl border bg-slate-50/60 p-5">
                  <div className="flex items-start justify-between"><p className="text-sm font-medium text-slate-500">{String(row.metric)}</p><span className={`text-xs font-semibold ${String(row.trend).startsWith('-') ? 'text-rose-600' : 'text-emerald-600'}`}>{String(row.trend)}</span></div>
                  <p className="mt-3 text-3xl font-bold text-slate-900">{String(row.value)} <span className="text-sm font-normal text-slate-400">{String(row.unit)}</span></p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="anomalies" className="m-0"><GenericTable rows={filteredAnomalies} /></TabsContent>
      </Tabs>
    </div>
  );
}

