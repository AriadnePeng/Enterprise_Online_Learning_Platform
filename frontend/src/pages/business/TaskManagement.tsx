import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { CalendarClock, CheckCircle2, Clock3, ListChecks, Plus, Search, Send, TimerReset, UsersRound } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';
import type { BusinessRecord, TrainingTaskRecord } from '@/types/business';
import { PageHeader } from '@/components/business/PageHeader';
import { MetricCard } from '@/components/business/MetricCard';
import { StatusPill } from '@/components/business/StatusPill';
import { TableState } from '@/components/business/TableState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BatchForm {
  p_task_id: string;
  p_task_name: string;
  p_creator_id: string;
  p_target_position: string;
  p_deadline: number;
}

const emptyBatch: BatchForm = {
  p_task_id: '',
  p_task_name: '',
  p_creator_id: 'A001',
  p_target_position: '全员',
  p_deadline: 24,
};

export default function TaskManagement() {
  const [tasks, setTasks] = useState<TrainingTaskRecord[]>([]);
  const [progressRows, setProgressRows] = useState<BusinessRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchForm, setBatchForm] = useState<BatchForm>(emptyBatch);
  const [delayTask, setDelayTask] = useState<TrainingTaskRecord | null>(null);
  const [newDeadline, setNewDeadline] = useState(24);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [taskData, progressData] = await Promise.all([
        api.crud.list('training_task'),
        api.view.getTaskProgress(),
      ]);
      setTasks(taskData as TrainingTaskRecord[]);
      setProgressRows(progressData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '培训任务加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const progressMap = useMemo(() => new Map(progressRows.map((row) => [String(row.task_id), Number(row.completion_rate ?? 0)])), [progressRows]);
  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const keyword = search.trim().toLowerCase();
    return !keyword || [task.task_id, task.task_name, task.target_position].some((value) => value.toLowerCase().includes(keyword));
  }), [search, tasks]);

  const submitBatch = async (event: FormEvent) => {
    event.preventDefault();
    if (!batchForm.p_task_name.trim() || !batchForm.p_target_position.trim()) {
      toast.error('请填写任务名称和派发范围');
      return;
    }
    setSubmitting(true);
    try {
      const message = await api.procedure.batchAssignTask(batchForm);
      toast.success(message || '任务批量派发成功');
      setBatchOpen(false);
      setBatchForm(emptyBatch);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '派发失败');
    } finally {
      setSubmitting(false);
    }
  };

  const submitDelay = async () => {
    if (!delayTask) return;
    setSubmitting(true);
    try {
      const message = await api.procedure.updateTaskTime({ p_task_id: delayTask.task_id, p_new_deadline: newDeadline });
      toast.success(message || '任务时间已调整');
      setDelayTask(null);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '延期失败');
    } finally {
      setSubmitting(false);
    }
  };

  const totalAssigned = tasks.reduce((sum, task) => sum + task.assigned_count, 0);
  const totalCompleted = tasks.reduce((sum, task) => sum + task.completed_count, 0);
  const averageRate = totalAssigned ? Math.round(totalCompleted / totalAssigned * 100) : 0;
  const delayedCount = tasks.filter((task) => (progressMap.get(task.task_id) ?? 0) < 30).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="培训任务管理"
        description="按岗位批量派发培训任务、调整学习时限，并通过全局进度视图跟踪完成情况。"
        actions={<Button onClick={() => setBatchOpen(true)}><Send />批量派发任务</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="任务总数" value={tasks.length} hint="当前培训计划" icon={ListChecks} />
        <MetricCard label="派发人次" value={totalAssigned} hint="累计覆盖学员" icon={UsersRound} tone="violet" />
        <MetricCard label="总体完成率" value={`${averageRate}%`} hint={`${totalCompleted} 人次已完成`} icon={CheckCircle2} tone="emerald" />
        <MetricCard label="低进度任务" value={delayedCount} hint="完成率低于 30%" icon={CalendarClock} tone="rose" />
      </div>

      <div className="db-card overflow-hidden">
        <div className="border-b p-4">
          <div className="relative max-w-lg"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索任务编号、名称或目标岗位" className="pl-9" /></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3.5">培训任务</th><th className="px-5 py-3.5">派发范围</th><th className="px-5 py-3.5">学习时限</th><th className="px-5 py-3.5">参与情况</th><th className="px-5 py-3.5">完成进度</th><th className="px-5 py-3.5">状态</th><th className="px-5 py-3.5 text-right">操作</th></tr></thead>
            <tbody className="divide-y">
              <TableState loading={loading} empty={!filteredTasks.length} colSpan={7} />
              {!loading && filteredTasks.map((task) => {
                const rate = progressMap.get(task.task_id) ?? (task.assigned_count ? Math.round(task.completed_count / task.assigned_count * 100) : 0);
                return (
                  <tr key={task.task_id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4"><p className="font-semibold text-slate-800">{task.task_name}</p><p className="mt-1 text-xs text-slate-400">{task.task_id} · {task.user_create_time}</p></td>
                    <td className="px-5 py-4"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">{task.target_position}</span></td>
                    <td className="px-5 py-4 font-medium text-slate-700">{task.task_deadline} 小时</td>
                    <td className="px-5 py-4 text-slate-600">{task.completed_count} / {task.assigned_count} 人</td>
                    <td className="w-52 px-5 py-4"><div className="mb-1.5 flex justify-between text-xs"><span className="text-slate-500">完成率</span><strong className={rate < 30 ? 'text-rose-600' : 'text-emerald-600'}>{rate}%</strong></div><Progress value={rate} className="h-2" /></td>
                    <td className="px-5 py-4"><StatusPill active={task.learning_status === 1} activeText="进行中" inactiveText="已暂停" /></td>
                    <td className="px-5 py-4 text-right"><Button variant="outline" size="sm" onClick={() => { setDelayTask(task); setNewDeadline(task.task_deadline); }}><TimerReset />延期</Button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={batchOpen} onOpenChange={setBatchOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader><DialogTitle>批量派发培训任务</DialogTitle><DialogDescription>存储过程会根据目标岗位筛选学员，并自动初始化学习进度记录。</DialogDescription></DialogHeader>
          <form onSubmit={submitBatch} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="task_id">任务编号</Label><Input id="task_id" placeholder="留空自动生成" value={batchForm.p_task_id} onChange={(event) => setBatchForm({ ...batchForm, p_task_id: event.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="creator">创建人编号</Label><Input id="creator" value={batchForm.p_creator_id} onChange={(event) => setBatchForm({ ...batchForm, p_creator_id: event.target.value })} /></div>
            <div className="space-y-2 sm:col-span-2"><Label htmlFor="task_name">任务名称 *</Label><Input id="task_name" value={batchForm.p_task_name} onChange={(event) => setBatchForm({ ...batchForm, p_task_name: event.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="target">目标岗位 *</Label><Input id="target" placeholder="如：安全工程师 / 全员" value={batchForm.p_target_position} onChange={(event) => setBatchForm({ ...batchForm, p_target_position: event.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="deadline">要求学时</Label><Input id="deadline" type="number" min="1" value={batchForm.p_deadline} onChange={(event) => setBatchForm({ ...batchForm, p_deadline: Number(event.target.value) })} /></div>
            <DialogFooter className="sm:col-span-2"><Button type="button" variant="outline" onClick={() => setBatchOpen(false)}>取消</Button><Button type="submit" disabled={submitting}><Plus />确认派发</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(delayTask)} onOpenChange={(open) => !open && setDelayTask(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>调整任务时限</DialogTitle><DialogDescription>为“{delayTask?.task_name}”设置新的要求学时。</DialogDescription></DialogHeader>
          <div className="space-y-2"><Label htmlFor="new_deadline">新时限（小时）</Label><div className="relative"><Clock3 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><Input id="new_deadline" type="number" min="1" value={newDeadline} onChange={(event) => setNewDeadline(Number(event.target.value))} className="pl-9" /></div></div>
          <DialogFooter><Button variant="outline" onClick={() => setDelayTask(null)}>取消</Button><Button disabled={submitting} onClick={() => void submitDelay()}>确认延期</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

