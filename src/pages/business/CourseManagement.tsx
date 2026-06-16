import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { BookOpen, Download, EyeOff, FileSpreadsheet, Library, Pencil, Plus, Search, Trash2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';
import type { CourseRecord } from '@/types/business';
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
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { exportToCsv, exportToExcel } from '@/utils/export';

const emptyCourse: CourseRecord = {
  course_id: 0,
  course_name: '',
  course_code: '',
  category_name: '安全合规',
  lecturer_name: '',
  course_status: 1,
  course_desc: '',
};

export default function CourseManagement() {
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('全部');
  const [status, setStatus] = useState('全部');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CourseRecord | null>(null);
  const [form, setForm] = useState<CourseRecord>(emptyCourse);
  const [deleting, setDeleting] = useState<CourseRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [switchingId, setSwitchingId] = useState<number | null>(null);

  const loadCourses = async () => {
    setLoading(true);
    try {
      setCourses(await api.crud.list('course') as CourseRecord[]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '课程加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCourses();
  }, []);

  const categories = useMemo(() => Array.from(new Set(courses.map((course) => course.category_name))), [courses]);
  const filteredCourses = useMemo(() => courses.filter((course) => {
    const keyword = search.trim().toLowerCase();
    const matchesKeyword = !keyword || [course.course_name, course.course_code, course.lecturer_name].some((value) => value.toLowerCase().includes(keyword));
    return matchesKeyword
      && (category === '全部' || course.category_name === category)
      && (status === '全部' || course.course_status === Number(status));
  }), [category, courses, search, status]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyCourse);
    setDialogOpen(true);
  };

  const openEdit = (course: CourseRecord) => {
    setEditing(course);
    setForm({ ...course });
    setDialogOpen(true);
  };

  const saveCourse = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.course_name.trim() || !form.course_code.trim() || !form.lecturer_name.trim()) {
      toast.error('请完整填写课程名称、编码与讲师');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await api.crud.update('course', form);
        toast.success('课程信息已更新');
      } else {
        await api.crud.add('course', { ...form, course_id: 0 });
        toast.success('课程已创建');
      }
      setDialogOpen(false);
      await loadCourses();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const toggleCourse = async (course: CourseRecord) => {
    setSwitchingId(course.course_id);
    try {
      if (course.course_status === 1) {
        await api.procedure.offlineCourse(course.course_id);
        toast.success('课程已下架，关联章节与资源同步隐藏');
      } else {
        await api.crud.update('course', { ...course, course_status: 1 });
        toast.success('课程已重新上架');
      }
      await loadCourses();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '状态切换失败');
    } finally {
      setSwitchingId(null);
    }
  };

  const deleteCourse = async () => {
    if (!deleting) return;
    try {
      await api.crud.delete('course', deleting.course_id);
      toast.success('课程已删除');
      setDeleting(null);
      await loadCourses();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除失败');
    }
  };

  const onlineCount = courses.filter((course) => course.course_status === 1).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="课程管理"
        description="统一维护课程目录、讲师、分类和上架状态，下架操作通过存储过程联动处理课程资源。"
        actions={(
          <>
            <Button variant="outline" onClick={() => exportToCsv(filteredCourses, '课程目录')}><Download />CSV</Button>
            <Button variant="outline" onClick={() => exportToExcel(filteredCourses, '课程目录')}><FileSpreadsheet />Excel</Button>
            <Button onClick={openCreate}><Plus />新增课程</Button>
          </>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="课程总数" value={courses.length} hint="企业课程资源" icon={Library} />
        <MetricCard label="已上架" value={onlineCount} hint={`上架率 ${courses.length ? Math.round(onlineCount / courses.length * 100) : 0}%`} icon={UploadCloud} tone="emerald" />
        <MetricCard label="已下架" value={courses.length - onlineCount} hint="暂不对学员开放" icon={EyeOff} tone="rose" />
        <MetricCard label="课程分类" value={categories.length} hint="覆盖知识领域" icon={BookOpen} tone="violet" />
      </div>

      <div className="db-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索课程名称、编码或讲师" className="pl-9" />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full lg:w-44"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="全部">全部分类</SelectItem>{categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full lg:w-36"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="全部">全部状态</SelectItem><SelectItem value="1">已上架</SelectItem><SelectItem value="0">已下架</SelectItem></SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr><th className="px-5 py-3.5">课程</th><th className="px-5 py-3.5">分类</th><th className="px-5 py-3.5">讲师</th><th className="px-5 py-3.5">状态</th><th className="px-5 py-3.5">课程简介</th><th className="px-5 py-3.5 text-right">操作</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TableState loading={loading} empty={!filteredCourses.length} colSpan={6} />
              {!loading && filteredCourses.map((course) => (
                <tr key={course.course_id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-4"><p className="font-semibold text-slate-800">{course.course_name}</p><p className="mt-1 font-mono text-xs text-blue-600">{course.course_code}</p></td>
                  <td className="px-5 py-4"><span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">{course.category_name}</span></td>
                  <td className="px-5 py-4 text-slate-600">{course.lecturer_name}</td>
                  <td className="px-5 py-4"><StatusPill active={course.course_status === 1} activeText="已上架" inactiveText="已下架" /></td>
                  <td className="max-w-xs truncate px-5 py-4 text-slate-500">{course.course_desc}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" disabled={switchingId === course.course_id} onClick={() => void toggleCourse(course)}>{course.course_status ? '下架' : '上架'}</Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(course)}><Pencil /></Button>
                      <Button variant="ghost" size="icon-sm" className="text-rose-600 hover:bg-rose-50" onClick={() => setDeleting(course)}><Trash2 /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t px-5 py-3 text-xs text-slate-400">显示 {filteredCourses.length} / {courses.length} 门课程</div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader><DialogTitle>{editing ? '编辑课程' : '新增课程'}</DialogTitle><DialogDescription>填写课程基础信息，上架后学员可在课程中心访问。</DialogDescription></DialogHeader>
          <form onSubmit={saveCourse} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="course_name">课程名称 *</Label><Input id="course_name" value={form.course_name} onChange={(event) => setForm({ ...form, course_name: event.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="course_code">课程编码 *</Label><Input id="course_code" value={form.course_code} onChange={(event) => setForm({ ...form, course_code: event.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="category_name">课程分类</Label><Input id="category_name" value={form.category_name} onChange={(event) => setForm({ ...form, category_name: event.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="lecturer_name">讲师 *</Label><Input id="lecturer_name" value={form.lecturer_name} onChange={(event) => setForm({ ...form, lecturer_name: event.target.value })} /></div>
            <div className="space-y-2 sm:col-span-2"><Label htmlFor="course_desc">课程简介</Label><Textarea id="course_desc" rows={4} value={form.course_desc} onChange={(event) => setForm({ ...form, course_desc: event.target.value })} /></div>
            <div className="space-y-2"><Label>初始状态</Label><Select value={String(form.course_status)} onValueChange={(value) => setForm({ ...form, course_status: Number(value) })}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">上架</SelectItem><SelectItem value="0">下架</SelectItem></SelectContent></Select></div>
            <DialogFooter className="sm:col-span-2"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>取消</Button><Button type="submit" disabled={saving}>{saving ? '保存中...' : '保存课程'}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>确认删除课程？</AlertDialogTitle><AlertDialogDescription>“{deleting?.course_name}”将从课程目录移除，此操作不可撤销。</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>取消</AlertDialogCancel><AlertDialogAction className="bg-rose-600 hover:bg-rose-700" onClick={() => void deleteCourse()}>确认删除</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

