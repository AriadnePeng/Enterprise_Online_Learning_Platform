import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Award, BarChart3, ClipboardCheck, Clock3, Eye, FileText, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';
import type { BusinessRecord, ExamRecord } from '@/types/business';
import { PageHeader } from '@/components/business/PageHeader';
import { MetricCard } from '@/components/business/MetricCard';
import { StatusPill } from '@/components/business/StatusPill';
import { TableState } from '@/components/business/TableState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { exportToExcel } from '@/utils/export';

const emptyExam: ExamRecord = {
  exam_id: 0,
  exam_name: '',
  exam_desc: '',
  exam_duration: 90,
  start_time: '',
  end_time: '',
  pass_score: 60,
  exam_status: 0,
  admin_id: 1,
};

function DataTable({ rows }: { rows: BusinessRecord[] }) {
  if (!rows.length) return <div className="py-16 text-center text-sm text-slate-400">暂无数据</div>;
  const headers = Object.keys(rows[0]);
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[900px] text-xs">
        <thead className="bg-slate-50 text-left text-slate-500"><tr>{headers.map((header) => <th key={header} className="px-3 py-3 font-semibold">{header}</th>)}</tr></thead>
        <tbody className="divide-y">{rows.map((row, index) => <tr key={index} className="hover:bg-slate-50">{headers.map((header) => <td key={header} className="max-w-xs truncate px-3 py-3 text-slate-600">{String(row[header] ?? '-')}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export default function ExamManagement() {
  const [exams, setExams] = useState<ExamRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('全部');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ExamRecord | null>(null);
  const [form, setForm] = useState<ExamRecord>(emptyExam);
  const [detailOpen, setDetailOpen] = useState(false);
  const [scoreRows, setScoreRows] = useState<BusinessRecord[]>([]);
  const [answerRows, setAnswerRows] = useState<BusinessRecord[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadExams = async () => {
    setLoading(true);
    try {
      setExams(await api.crud.list('exam') as ExamRecord[]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '考试加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadExams();
  }, []);

  const filteredExams = useMemo(() => exams.filter((exam) => {
    const keyword = search.trim().toLowerCase();
    return (!keyword || exam.exam_name.toLowerCase().includes(keyword) || String(exam.exam_id).includes(keyword))
      && (status === '全部' || exam.exam_status === Number(status));
  }), [exams, search, status]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyExam);
    setDialogOpen(true);
  };

  const openEdit = (exam: ExamRecord) => {
    setEditing(exam);
    setForm({ ...exam });
    setDialogOpen(true);
  };

  const saveExam = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.exam_name.trim() || !form.start_time || !form.end_time) {
      toast.error('请填写考试名称和起止时间');
      return;
    }
    try {
      if (editing) {
        await api.crud.update('exam', form);
        toast.success('考试信息已更新');
      } else {
        await api.crud.add('exam', { ...form, exam_id: 0 });
        toast.success('考试已创建');
      }
      setDialogOpen(false);
      await loadExams();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败');
    }
  };

  const deleteExam = async (exam: ExamRecord) => {
    if (!window.confirm(`确认删除考试“${exam.exam_name}”？`)) return;
    try {
      await api.crud.delete('exam', exam.exam_id);
      toast.success('考试已删除');
      await loadExams();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除失败');
    }
  };

  const openDetails = async () => {
    setDetailOpen(true);
    if (scoreRows.length || answerRows.length) return;
    setDetailLoading(true);
    try {
      const [scores, answers] = await Promise.all([api.view.getExamScoreSummary(), api.view.getAnswerSheets()]);
      setScoreRows(scores);
      setAnswerRows(answers);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '考试明细加载失败');
    } finally {
      setDetailLoading(false);
    }
  };

  const activeCount = exams.filter((exam) => exam.exam_status === 1).length;
  const averagePassScore = exams.length ? Math.round(exams.reduce((sum, exam) => sum + exam.pass_score, 0) / exams.length) : 0;
  const averageDuration = exams.length ? Math.round(exams.reduce((sum, exam) => sum + exam.exam_duration, 0) / exams.length) : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="考试管理"
        description="配置考试时间、及格线与发布状态，并通过数据库视图查看成绩汇总和答卷明细。"
        actions={<><Button variant="outline" onClick={() => void openDetails()}><BarChart3 />成绩与答卷</Button><Button onClick={openCreate}><Plus />新增考试</Button></>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="考试总数" value={exams.length} hint="全部考试场次" icon={ClipboardCheck} />
        <MetricCard label="已发布" value={activeCount} hint="学员可见考试" icon={Award} tone="emerald" />
        <MetricCard label="平均及格线" value={`${averagePassScore}分`} hint="各场考试平均值" icon={BarChart3} tone="amber" />
        <MetricCard label="平均时长" value={`${averageDuration}分钟`} hint="单场作答时间" icon={Clock3} tone="violet" />
      </div>

      <div className="db-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row">
          <div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索考试名称或编号" className="pl-9" /></div>
          <Select value={status} onValueChange={setStatus}><SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="全部">全部状态</SelectItem><SelectItem value="1">已发布</SelectItem><SelectItem value="0">草稿</SelectItem></SelectContent></Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3.5">考试</th><th className="px-5 py-3.5">考试时间</th><th className="px-5 py-3.5">时长</th><th className="px-5 py-3.5">及格线</th><th className="px-5 py-3.5">状态</th><th className="px-5 py-3.5 text-right">操作</th></tr></thead>
            <tbody className="divide-y">
              <TableState loading={loading} empty={!filteredExams.length} colSpan={6} />
              {!loading && filteredExams.map((exam) => (
                <tr key={exam.exam_id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-4"><p className="font-semibold text-slate-800">{exam.exam_name}</p><p className="mt-1 text-xs text-slate-400">EXAM-{String(exam.exam_id).padStart(3, '0')} · {exam.exam_desc}</p></td>
                  <td className="px-5 py-4 text-xs text-slate-600"><p>{exam.start_time}</p><p className="mt-1 text-slate-400">至 {exam.end_time}</p></td>
                  <td className="px-5 py-4 font-medium text-slate-700">{exam.exam_duration} 分钟</td>
                  <td className="px-5 py-4"><span className="rounded-lg bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">{exam.pass_score} 分</span></td>
                  <td className="px-5 py-4"><StatusPill active={exam.exam_status === 1} activeText="已发布" inactiveText="草稿" /></td>
                  <td className="px-5 py-4"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon-sm" title="查看成绩" onClick={() => void openDetails()}><Eye /></Button><Button variant="ghost" size="icon-sm" onClick={() => openEdit(exam)}><Pencil /></Button><Button variant="ghost" size="icon-sm" className="text-rose-600 hover:bg-rose-50" onClick={() => void deleteExam(exam)}><Trash2 /></Button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? '编辑考试' : '新增考试'}</DialogTitle><DialogDescription>设置考试窗口、时长与及格标准。</DialogDescription></DialogHeader>
          <form onSubmit={saveExam} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2"><Label htmlFor="exam_name">考试名称 *</Label><Input id="exam_name" value={form.exam_name} onChange={(event) => setForm({ ...form, exam_name: event.target.value })} /></div>
            <div className="space-y-2 sm:col-span-2"><Label htmlFor="exam_desc">考试说明</Label><Textarea id="exam_desc" value={form.exam_desc} onChange={(event) => setForm({ ...form, exam_desc: event.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="start_time">开始时间 *</Label><Input id="start_time" type="datetime-local" value={form.start_time.replace(' ', 'T')} onChange={(event) => setForm({ ...form, start_time: event.target.value.replace('T', ' ') })} /></div>
            <div className="space-y-2"><Label htmlFor="end_time">结束时间 *</Label><Input id="end_time" type="datetime-local" value={form.end_time.replace(' ', 'T')} onChange={(event) => setForm({ ...form, end_time: event.target.value.replace('T', ' ') })} /></div>
            <div className="space-y-2"><Label htmlFor="duration">时长（分钟）</Label><Input id="duration" type="number" min="1" value={form.exam_duration} onChange={(event) => setForm({ ...form, exam_duration: Number(event.target.value) })} /></div>
            <div className="space-y-2"><Label htmlFor="pass_score">及格分</Label><Input id="pass_score" type="number" min="0" max="100" value={form.pass_score} onChange={(event) => setForm({ ...form, pass_score: Number(event.target.value) })} /></div>
            <div className="space-y-2"><Label>发布状态</Label><Select value={String(form.exam_status)} onValueChange={(value) => setForm({ ...form, exam_status: Number(value) })}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="0">草稿</SelectItem><SelectItem value="1">已发布</SelectItem></SelectContent></Select></div>
            <DialogFooter className="sm:col-span-2"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>取消</Button><Button type="submit">保存考试</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-6xl">
          <DialogHeader><DialogTitle>考试数据中心</DialogTitle><DialogDescription>数据来自考试成绩汇总视图与答卷详情视图。</DialogDescription></DialogHeader>
          {detailLoading ? <div className="py-20 text-center text-sm text-slate-400">正在查询数据库视图...</div> : (
            <Tabs defaultValue="scores">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <TabsList><TabsTrigger value="scores"><Award />成绩汇总</TabsTrigger><TabsTrigger value="answers"><FileText />答卷详情</TabsTrigger></TabsList>
                <Button variant="outline" size="sm" onClick={() => exportToExcel(scoreRows, '考试成绩汇总')}><FileText />导出成绩</Button>
              </div>
              <TabsContent value="scores" className="mt-4"><DataTable rows={scoreRows} /></TabsContent>
              <TabsContent value="answers" className="mt-4"><DataTable rows={answerRows} /></TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

