import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Download, FileSpreadsheet, Filter, Pencil, Plus, Search, Trash2, Upload, UserCheck, Users, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';
import type { UserRecord } from '@/types/business';
import { PageHeader } from '@/components/business/PageHeader';
import { MetricCard } from '@/components/business/MetricCard';
import { StatusPill } from '@/components/business/StatusPill';
import { TableState } from '@/components/business/TableState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { exportToCsv, exportToExcel } from '@/utils/export';
import { previewDataFile, type ImportPreview } from '@/utils/import';

const emptyForm: UserRecord = {
  user_id: '',
  username: '',
  role: '学员',
  position: '',
  learning_status: 1,
  contact: '',
  user_create_time: '',
};

export default function UserManagement() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('全部');
  const [status, setStatus] = useState('全部');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<UserRecord | null>(null);
  const [form, setForm] = useState<UserRecord>(emptyForm);
  const [deleting, setDeleting] = useState<UserRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.crud.list('user_info');
      setUsers(data as UserRecord[]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '学员数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const filteredUsers = useMemo(() => users.filter((user) => {
    const keyword = search.trim().toLowerCase();
    const matchesKeyword = !keyword || [user.user_id, user.username, user.position, user.contact]
      .some((value) => String(value).toLowerCase().includes(keyword));
    const matchesRole = role === '全部' || user.role === role;
    const matchesStatus = status === '全部' || user.learning_status === Number(status);
    return matchesKeyword && matchesRole && matchesStatus;
  }), [role, search, status, users]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, user_create_time: new Date().toISOString().slice(0, 19).replace('T', ' ') });
    setDialogOpen(true);
  };

  const openEdit = (user: UserRecord) => {
    setEditing(user);
    setForm({ ...user });
    setDialogOpen(true);
  };

  const saveUser = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.username.trim() || !form.position.trim() || !form.contact.trim()) {
      toast.error('请完整填写姓名、岗位和联系方式');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await api.crud.update('user_info', form);
        toast.success('学员信息已更新');
      } else {
        await api.crud.add('user_info', form);
        toast.success('学员已创建');
      }
      setDialogOpen(false);
      await loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async () => {
    if (!deleting) return;
    try {
      await api.crud.delete('user_info', deleting.user_id);
      toast.success(`已删除 ${deleting.username}`);
      setDeleting(null);
      await loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除失败');
    }
  };

  const handleImportFile = async (file?: File) => {
    if (!file) return;
    try {
      setImportPreview(await previewDataFile(file));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '文件解析失败');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const confirmImport = async () => {
    if (!importPreview) return;
    const allowedKeys = Object.keys(emptyForm);
    try {
      await Promise.all(importPreview.rows.map((row) => {
        const normalized: Record<string, unknown> = Object.fromEntries(allowedKeys.map((key) => [key, row[key] ?? '']));
        normalized.learning_status = Number(normalized.learning_status || 1);
        normalized.user_create_time ||= new Date().toISOString().slice(0, 19).replace('T', ' ');
        return api.crud.add('user_info', normalized);
      }));
      toast.success(`成功导入 ${importPreview.rows.length} 条学员记录`);
      setImportPreview(null);
      await loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '导入失败，请检查编号是否重复');
    }
  };

  const activeCount = users.filter((user) => user.learning_status === 1).length;
  const learnerCount = users.filter((user) => user.role === '学员').length;
  const positionCount = new Set(users.map((user) => user.position)).size;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="学员管理"
        description="维护企业学习账号、岗位与学习状态，支持批量导入和报表导出。"
        actions={(
          <>
            <input ref={fileInputRef} type="file" accept=".csv,.xls" className="hidden" onChange={(event) => void handleImportFile(event.target.files?.[0])} />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}><Upload />导入</Button>
            <Button variant="outline" onClick={() => exportToCsv(filteredUsers, '学员名单')}><Download />CSV</Button>
            <Button variant="outline" onClick={() => exportToExcel(filteredUsers, '学员名单')}><FileSpreadsheet />Excel</Button>
            <Button onClick={openCreate}><Plus />新增学员</Button>
          </>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="账号总数" value={users.length} hint="当前平台用户" icon={Users} />
        <MetricCard label="有效账号" value={activeCount} hint={`启用率 ${users.length ? Math.round(activeCount / users.length * 100) : 0}%`} icon={UserCheck} tone="emerald" />
        <MetricCard label="正式学员" value={learnerCount} hint="不含讲师与管理员" icon={UserCheck} tone="violet" />
        <MetricCard label="覆盖岗位" value={positionCount} hint="组织学习岗位范围" icon={UserX} tone="amber" />
      </div>

      <div className="db-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索编号、姓名、岗位或手机号" className="pl-9" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full sm:w-36"><Filter /><SelectValue /></SelectTrigger>
              <SelectContent>
                {['全部', '学员', '讲师', '管理员'].map((item) => <SelectItem key={item} value={item}>{item === '全部' ? '全部角色' : item}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="全部">全部状态</SelectItem>
                <SelectItem value="1">正常</SelectItem>
                <SelectItem value="0">停用</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3.5">学员</th>
                <th className="px-5 py-3.5">角色 / 岗位</th>
                <th className="px-5 py-3.5">联系方式</th>
                <th className="px-5 py-3.5">状态</th>
                <th className="px-5 py-3.5">创建时间</th>
                <th className="px-5 py-3.5 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TableState loading={loading} empty={!filteredUsers.length} colSpan={6} />
              {!loading && filteredUsers.map((user) => (
                <tr key={user.user_id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">{user.username.slice(-1)}</div>
                      <div><p className="font-semibold text-slate-800">{user.username}</p><p className="text-xs text-slate-400">{user.user_id}</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><p className="font-medium text-slate-700">{user.position}</p><p className="text-xs text-slate-400">{user.role}</p></td>
                  <td className="px-5 py-4 text-slate-600">{user.contact}</td>
                  <td className="px-5 py-4"><StatusPill active={user.learning_status === 1} /></td>
                  <td className="px-5 py-4 text-slate-500">{user.user_create_time}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" aria-label="编辑学员" onClick={() => openEdit(user)}><Pencil /></Button>
                      <Button variant="ghost" size="icon-sm" aria-label="删除学员" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => setDeleting(user)}><Trash2 /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">显示 {filteredUsers.length} / {users.length} 条记录</div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? '编辑学员' : '新增学员'}</DialogTitle>
            <DialogDescription>学员编号可留空由系统自动生成，带星号项目必须填写。</DialogDescription>
          </DialogHeader>
          <form onSubmit={saveUser} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="user_id">学员编号</Label><Input id="user_id" value={form.user_id} disabled={Boolean(editing)} placeholder="自动生成" onChange={(event) => setForm({ ...form, user_id: event.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="username">姓名 *</Label><Input id="username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} /></div>
            <div className="space-y-2"><Label>角色</Label><Select value={form.role} onValueChange={(value) => setForm({ ...form, role: value })}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{['学员', '讲师', '管理员'].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label htmlFor="position">岗位 *</Label><Input id="position" value={form.position} onChange={(event) => setForm({ ...form, position: event.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="contact">联系方式 *</Label><Input id="contact" value={form.contact} onChange={(event) => setForm({ ...form, contact: event.target.value })} /></div>
            <div className="space-y-2"><Label>状态</Label><Select value={String(form.learning_status)} onValueChange={(value) => setForm({ ...form, learning_status: Number(value) })}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">正常</SelectItem><SelectItem value="0">停用</SelectItem></SelectContent></Select></div>
            <DialogFooter className="sm:col-span-2 mt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
              <Button type="submit" disabled={saving}>{saving ? '保存中...' : '保存学员'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>确认删除学员？</AlertDialogTitle><AlertDialogDescription>即将删除“{deleting?.username}”（{deleting?.user_id}）。该操作不可撤销。</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>取消</AlertDialogCancel><AlertDialogAction className="bg-rose-600 hover:bg-rose-700" onClick={() => void deleteUser()}>确认删除</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={Boolean(importPreview)} onOpenChange={(open) => !open && setImportPreview(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader><DialogTitle>导入数据预览</DialogTitle><DialogDescription>确认字段名与数据无误后导入，当前共 {importPreview?.rows.length ?? 0} 条。</DialogDescription></DialogHeader>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[700px] text-xs">
              <thead className="bg-slate-50"><tr>{importPreview?.headers.map((header) => <th key={header} className="px-3 py-2 text-left">{header}</th>)}</tr></thead>
              <tbody>{importPreview?.rows.slice(0, 8).map((row, index) => <tr key={index} className="border-t">{importPreview.headers.map((header) => <td key={header} className="px-3 py-2">{row[header]}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setImportPreview(null)}>取消</Button><Button onClick={() => void confirmImport()}>确认导入</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
