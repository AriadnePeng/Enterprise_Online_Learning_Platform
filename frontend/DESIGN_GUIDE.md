# 前端协作设计规范

## 1. 技术栈
- React 18 + TypeScript + Vite
- Tailwind CSS 3.4 + shadcn/ui
- React Router DOM (HashRouter)
- Lucide React (图标库)

## 2. 安装依赖
```bash
cd /mnt/agents/output/app
npm install          # 安装已有依赖
npm install echarts  # 如果要图表
npm install xlsx     # 如果要导出Excel
```

## 3. 项目目录结构
```
src/
  components/ui/     # shadcn/ui 组件（直接用，不要改）
  components/layout/ # 布局组件
  components/        # 你的新组件放这里
  pages/             # 页面组件
  hooks/             # 自定义hooks
  services/          # API 服务层
  types/             # TypeScript类型
  data/              # 静态数据
  utils/             # 工具函数
  index.css          # 全局样式+自定义类
```

## 4. 命名规范
| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `UserManagement.tsx` |
| 工具文件 | camelCase | `exportToExcel.ts` |
| CSS类名 | 自定义db-前缀 | `db-card`, `db-badge-table` |
| 接口函数 | camelCase | `getUserList`, `createExam` |

## 5. 样式规范

### 5.1 使用已有的自定义类
```css
/* 卡片容器 */
.db-card          /* 白色圆角卡片带边框 */
.db-card-dark     /* 深色卡片 */

/* 徽章标签 */
.db-badge-table      /* 蓝色 - 表 */
.db-badge-view       /* 绿色 - 视图 */
.db-badge-procedure  /* 黄色 - 存储过程 */
.db-badge-trigger    /* 红色 - 触发器 */

/* 其他 */
.db-section-title   /* 区块标题 */
.db-code-block      /* 代码块 */
.db-stat-card       /* 统计卡片 */
.db-page-header     /* 页面头部 */
.db-page-title      /* 页面标题 */
.db-page-desc       /* 页面描述 */
.db-table-row:hover /* 表格行hover */
```

### 5.2 颜色系统
```
主色调:    #1a73e8 (科技蓝)
成功/视图: #34a853 (绿色)
警告/过程: #fbbc05 (黄色)
危险/触发: #ea4335 (红色)
深色侧边栏: slate-900
背景色:    slate-50
卡片背景:  white
```

### 5.3 页面内容区域规范
```tsx
// 每个页面的根元素
<div className="space-y-6 max-w-7xl mx-auto">
  {/* 页面标题 */}
  <div className="db-page-header">
    <h1 className="db-page-title">页面标题</h1>
    <p className="db-page-desc">页面描述...</p>
  </div>
  
  {/* 内容区域 */}
  <div className="db-card p-6">
    {/* 内容 */}
  </div>
</div>
```

## 6. API调用规范

### 6.1 使用已有的API服务
```tsx
import { api } from '@/services/api';

// 视图查询
const data = await api.view.getTaskProgress();

// 存储过程调用
const result = await api.procedure.batchAssignTask({
  p_task_id: 'T011',
  p_task_name: '新任务',
  p_creator_id: 'U001',
  p_target_position: '安全工程师',
  p_deadline: 24,
});

// 基础CRUD
const list = await api.crud.list('user_info');
const detail = await api.crud.detail('user_info', 'U001');
await api.crud.add('user_info', { username: '张三', ... });
await api.crud.update('user_info', { user_id: 'U001', ... });
await api.crud.delete('user_info', 'U001');
```

### 6.2 新增API
如果需要新增接口，在 `src/services/api.ts` 中添加：
```tsx
// 按模块添加
export const newApi = {
  getStats: () => request<any>('/api/stats/dashboard'),
};
```

## 7. 路由规范

### 7.1 新增页面路由
在 `src/App.tsx` 中添加：
```tsx
import UserManagement from '@/pages/business/UserManagement';

<Route path="/users" element={<UserManagement />} />
```

### 7.2 侧边栏导航项
在 `src/components/layout/AppLayout.tsx` 的 `menuItems` 中添加：
```tsx
{ path: '/users', label: '学员管理', icon: Users },
```

## 8. Git协作建议

### 分支策略
```bash
main              # 主分支（可部署）
  ├── feature/visualization   # 数据可视化
  ├── feature/user-crud       # 学员CRUD
  ├── feature/login           # 登录系统
  └── feature/export          # 导入导出
```

### 提交规范
```
feat: 新增学员管理页面
fix: 修复表格分页bug
docs: 更新接口文档
style: 调整按钮样式
```

## 9. 组件开发示例

### 9.1 新页面模板
```tsx
// src/pages/business/UserManagement.tsx
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Users } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.crud.list('user_info');
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="db-page-header">
        <h1 className="db-page-title">学员管理</h1>
        <p className="db-page-desc">管理所有学员信息</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            学员列表
          </CardTitle>
          <Button onClick={() => {}}>新增学员</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户ID</TableHead>
                <TableHead>用户名</TableHead>
                <TableHead>岗位</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.user_id}>
                  <TableCell>{user.user_id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.position}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">编辑</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
```

## 10. 可用的 shadcn/ui 组件

项目已安装40+组件，直接导入使用：
```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';  // 提示消息
```

完整列表见：`src/components/ui/`
