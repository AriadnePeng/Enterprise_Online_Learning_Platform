import { useState } from 'react';
import { triggers } from '@/data/databaseObjects';
import {
  Zap,
  Code2,
  Play,
  CheckCircle,
  AlertTriangle,
  Database,
  Clock,
  Table2,
  Activity,
  PlayCircle,
  Ban
} from 'lucide-react';

export default function TriggerCenter() {
  const [selectedTrigger, setSelectedTrigger] = useState(triggers[0]);
  const [demoResult, setDemoResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [executedTriggers, setExecutedTriggers] = useState<Set<string>>(new Set());

  const runDemo = async (trigger: typeof triggers[0]) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const results: Record<string, any> = {
      'trg_update_progress_after_checkin': {
        action: '打卡插入后触发',
        before: { duration: 90, status: 0 },
        after: { duration: 120, status: 1 },
        message: '打卡成功！学习进度自动更新：时长+30分钟，状态变更为已完成',
      },
      'trg_prevent_cheating_checkin': {
        action: '打卡插入前触发（拦截）',
        attempt: { record_id: 'P001', checkin_time: '10:32:00', device: 'PC-Windows' },
        last_checkin: '10:30:00',
        interval_seconds: 120,
        result: 'BLOCKED',
        message: '打卡拒绝：两次打卡间隔2分钟，小于5分钟最低限制！触发器拦截成功。',
      },
      'trg_prevent_answer_update': {
        action: '试题更新前触发（拦截）',
        attempt: { question_id: 1, old_answer: 'C', new_answer: 'A' },
        exam_status: 1,
        result: 'BLOCKED',
        message: '考试进行中或已结束，禁止修改试题标准答案！触发器拦截成功。',
      },
      'trg_exam_score_review_time': {
        action: '成绩插入前触发（自动填充）',
        input: { user_id: 'U003', exam_id: 1, score: 88, review_time: null },
        output: { user_id: 'U003', exam_id: 1, score: 88, review_time: '2026-06-13 10:15:30' },
        message: 'review_time为空，触发器自动填充当前系统时间',
      },
      'trg_exam_score_after_insert': {
        action: '成绩插入后触发（日志记录）',
        input: { user_id: 'U002', exam_id: 9, final_score: 40 },
        result: { logged: true, fail_count: 3, risk: '连续不及格3次，需安排补考' },
        message: '成绩不及格(40<60)，触发器自动记录到exam_fail_log表',
      },
      'trg_learning_progress_after_update': {
        action: '进度更新后触发（状态联动）',
        before: { progress_id: 'P001', status: 1 },
        after: { progress_id: 'P001', status: 2 },
        cascade: { task_id: 'T001', task_status: '已更新为已完成' },
        message: '学习进度状态变为已完成，联动更新培训任务状态',
      },
      'tri_user_role_check': {
        action: '用户更新前触发（权限拦截）',
        attempt: { user_id: 'U001', old_role: '学员', new_role: '超级管理员' },
        result: 'BLOCKED',
        audit_log: { table: 'user_info', old_role: '学员', new_role: '超级管理员', remark: '非法操作被拦截' },
        message: '非法操作：禁止私自将角色修改为管理员！触发器拦截成功。',
      },
      'tri_admin_role_check': {
        action: '管理员更新前触发（权限拦截）',
        attempt: { admin_id: 5, old_role: '内容管理员', new_role: '超级管理员' },
        result: 'BLOCKED',
        audit_log: { table: 'administrator', old_role: '内容管理员', new_role: '超级管理员', remark: '非法升级被拦截' },
        message: '非法操作：普通管理员无法私自升级超级管理员！触发器拦截成功。',
      },
      'trg_chapter_insert': {
        action: '章节插入后触发（统计更新）',
        inserted: { course_id: 1, chapter_id: 11, duration: 45 },
        before: { course_id: 1, total_duration: 480 },
        after: { course_id: 1, total_duration: 525 },
        message: '新增章节后，自动更新课程总学时为525分钟',
      },
      'trg_course_status_change': {
        action: '课程状态更新后触发（级联更新）',
        changed: { course_id: 1, old_status: 1, new_status: 0 },
        cascade: {
          chapters: '5个章节已设为非免费',
          resources: '3个学习资源已隐藏',
          progress: '学习进度记录保留',
        },
        message: '课程下架成功，联动隐藏章节和学习资源',
      },
    };

    setDemoResult(results[trigger.name] || { message: '演示完成' });
    setExecutedTriggers((prev) => new Set(prev).add(trigger.name));
    setLoading(false);
  };

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'INSERT': return <PlayCircle className="w-4 h-4 text-emerald-500" />;
      case 'UPDATE': return <RotateCw className="w-4 h-4 text-blue-500" />;
      case 'DELETE': return <Ban className="w-4 h-4 text-rose-500" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="db-page-header">
        <h1 className="db-page-title">触发器演示中心</h1>
        <p className="db-page-desc">
          共 {triggers.length} 个触发器 — 自动化业务规则演示，包含联动更新、防作弊检测、权限拦截等
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trigger List */}
        <div className="lg:col-span-1 db-card p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-rose-500" />
            触发器列表
          </h3>
          <div className="space-y-1 max-h-[700px] overflow-y-auto">
            {triggers.map((trigger) => (
              <button
                key={trigger.id}
                onClick={() => {
                  setSelectedTrigger(trigger);
                  setDemoResult(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  selectedTrigger.id === trigger.id
                    ? 'bg-rose-50 border border-rose-200'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Zap className={`w-4 h-4 flex-shrink-0 ${
                  selectedTrigger.id === trigger.id ? 'text-rose-500' : 'text-slate-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    selectedTrigger.id === trigger.id ? 'text-rose-700' : 'text-slate-700'
                  }`}>
                    {trigger.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{trigger.nameCn}</p>
                </div>
                {executedTriggers.has(trigger.name) && (
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Trigger Detail */}
        <div className="lg:col-span-2 space-y-4">
          {/* Info Card */}
          <div className="db-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-rose-500" />
                  {selectedTrigger.name}
                </h2>
                <p className="text-sm text-slate-500 mt-1">{selectedTrigger.nameCn}</p>
                <p className="text-sm text-slate-600 mt-2">{selectedTrigger.description}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-medium text-slate-600">{selectedTrigger.timing}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                {getEventIcon(selectedTrigger.event)}
                <span className="text-xs font-medium text-blue-600">{selectedTrigger.event}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 rounded-lg">
                <Table2 className="w-3.5 h-3.5 text-violet-500" />
                <span className="text-xs font-medium text-violet-600">{selectedTrigger.table}</span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Database className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">关联表:</span>
              {selectedTrigger.relatedTables.map((t) => (
                <span key={t} className="db-badge-table">{t}</span>
              ))}
            </div>
          </div>

          {/* SQL Definition */}
          <div className="db-card p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-violet-500" />
              SQL 定义
            </h3>
            <pre className="db-code-block text-xs leading-relaxed overflow-x-auto">
              <code>{selectedTrigger.sql}</code>
            </pre>
          </div>

          {/* Demo Section */}
          <div className="db-card p-6 border-rose-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Play className="w-4 h-4 text-rose-500" />
                效果演示
              </h3>
              <button
                onClick={() => runDemo(selectedTrigger)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 text-sm font-medium transition-colors"
              >
                <Play className="w-4 h-4" />
                {loading ? '演示中...' : '运行演示'}
              </button>
            </div>

            {demoResult && (
              <div className="space-y-3">
                {/* Action Description */}
                <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                  <Activity className="w-4 h-4" />
                  {demoResult.action}
                </div>

                {/* Before/After or Result */}
                {demoResult.before && demoResult.after && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs font-semibold text-slate-500 mb-2">触发前 (BEFORE)</p>
                      <pre className="text-xs text-slate-600">
                        <code>{JSON.stringify(demoResult.before, null, 2)}</code>
                      </pre>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <p className="text-xs font-semibold text-emerald-600 mb-2">触发后 (AFTER)</p>
                      <pre className="text-xs text-emerald-700">
                        <code>{JSON.stringify(demoResult.after, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {demoResult.result === 'BLOCKED' && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
                    <div className="flex items-center gap-2 text-rose-700 font-semibold mb-2">
                      <AlertTriangle className="w-5 h-5" />
                      触发器拦截成功！
                    </div>
                    {demoResult.attempt && (
                      <div className="mb-2">
                        <p className="text-xs text-slate-500">尝试操作:</p>
                        <pre className="text-xs text-slate-600 mt-1">
                          <code>{JSON.stringify(demoResult.attempt, null, 2)}</code>
                        </pre>
                      </div>
                    )}
                    <p className="text-sm text-rose-600">{demoResult.message}</p>
                  </div>
                )}

                {demoResult.cascade && (
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <p className="text-xs font-semibold text-amber-600 mb-2">级联影响:</p>
                    <pre className="text-xs text-amber-700">
                      <code>{JSON.stringify(demoResult.cascade, null, 2)}</code>
                    </pre>
                  </div>
                )}

                {demoResult.audit_log && (
                  <div className="p-3 bg-violet-50 rounded-lg">
                    <p className="text-xs font-semibold text-violet-600 mb-2">审计日志:</p>
                    <pre className="text-xs text-violet-700">
                      <code>{JSON.stringify(demoResult.audit_log, null, 2)}</code>
                    </pre>
                  </div>
                )}

                {/* Message */}
                {demoResult.message && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                    <CheckCircle className="w-4 h-4" />
                    {demoResult.message}
                  </div>
                )}
              </div>
            )}

            {!demoResult && !loading && (
              <div className="text-center py-8 text-slate-400">
                <Zap className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">点击"运行演示"查看触发器执行效果</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Need to import this
function RotateCw(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
    </svg>
  );
}
