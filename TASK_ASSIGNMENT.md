# 前端开发任务分配

## 你的任务（框架负责人）
- [x] 项目初始化与基础框架搭建
- [x] 全局样式与设计规范
- [x] 侧边栏布局与路由系统
- [x] 数据库全景仪表盘
- [x] 数据表管理（结构展示）
- [x] 视图展示中心（SQL + 查询）
- [x] 存储过程控制台（参数 + 执行）
- [x] 触发器演示中心（SQL + 演示）
- [x] API服务层封装

## 另一位前端同学的任务（按优先级排序）

### 🔴 P0 - 核心功能（必须完成）

#### 任务1: 学员管理CRUD页面
**文件**: `src/pages/business/UserManagement.tsx`
**功能**:
- 学员列表展示（调用 `api.crud.list('user_info')`）
- 新增学员表单（模态框）
- 编辑学员信息
- 删除学员（确认对话框）
- 搜索/筛选

**参考接口**:
```
GET  /api/user_info/list
POST /api/user_info/add
POST /api/user_info/update
POST /api/user_info/delete/{id}
```

#### 任务2: 课程管理CRUD页面
**文件**: `src/pages/business/CourseManagement.tsx`
**功能**:
- 课程列表展示
- 新增/编辑/删除课程
- 课程状态切换（上架/下架）
- 调用 `api.procedure.offlineCourse(courseId)` 下架

#### 任务3: 考试管理页面
**文件**: `src/pages/business/ExamManagement.tsx`
**功能**:
- 考试列表
- 新增/编辑考试
- 查看成绩汇总（调用 `api.view.getExamScoreSummary()`）
- 查看答卷详情（调用 `api.view.getAnswerSheets()`）

### 🟡 P1 - 重要功能（推荐完成）

#### 任务4: 数据可视化大屏
**文件**: `src/pages/DataVisualization.tsx`
**依赖**: `npm install echarts`
**功能**:
- 学员活跃度趋势图
- 考试及格率饼图
- 课程分类柱状图
- 任务完成率仪表盘

#### 任务5: 培训任务管理
**文件**: `src/pages/business/TaskManagement.tsx`
**功能**:
- 任务列表
- 批量派发任务（调用 `api.procedure.batchAssignTask()`）
- 任务延期（调用 `api.procedure.updateTaskTime()`）
- 查看进度视图

#### 任务6: 统计分析报表页
**文件**: `src/pages/business/StatisticsReport.tsx`
**功能**:
- 全体学员统计（调用 `api.view.getLearningExamStats()`）
- 异常员工列表（调用 `api.view.getEmployeeAnomalies()`）
- 导出报表

### 🟢 P2 - 增强功能（有时间再做）

#### 任务7: 登录认证页面
**文件**: `src/pages/Login.tsx`, `src/hooks/useAuth.ts`
**功能**:
- 登录表单
- Token管理（localStorage）
- 路由守卫

#### 任务8: 数据导入导出
**文件**: `src/utils/export.ts`, `src/utils/import.ts`
**依赖**: `npm install xlsx`
**功能**:
- 导出Excel/CSV
- 导入数据预览

#### 任务9: API Mock系统
**文件**: `src/services/mockApi.ts`
**功能**:
- 模拟后端返回数据
- 方便前端独立开发和测试

#### 任务10: 响应式适配
**功能**:
- 适配平板设备
- 移动端基础适配

---

## 协作注意事项

### 1. 不要修改已有文件（除非你确认）
- `src/components/layout/AppLayout.tsx` - 如果要加导航项，先沟通
- `src/services/api.ts` - 如果要加接口，直接追加即可
- `src/index.css` - 可以追加新样式，不要删除已有样式
- `src/App.tsx` - 添加新路由时同步沟通

### 2. 新建文件目录
```
src/
  pages/business/     # 业务CRUD页面
  pages/              # 独立功能页面
  components/         # 可复用组件
  hooks/              # 自定义hooks
  utils/              # 工具函数
```

### 3. 路由注册
每新增一个页面，在 `src/App.tsx` 中添加路由：
```tsx
<Route path="/users" element={<UserManagement />} />
```

同时在 `src/components/layout/AppLayout.tsx` 的 `menuItems` 中添加导航：
```tsx
{ path: '/users', label: '学员管理', icon: Users },
```

### 4. 测试方法
```bash
cd /mnt/agents/output/app
npm run build    # 构建前确保无错误
```

### 5. 合并代码
建议用Git分支管理：
```bash
git checkout -b feature/user-management
# 开发完成后
git add .
git commit -m "feat: 新增学员管理页面"
git push origin feature/user-management
# 然后发起Pull Request合并
```
