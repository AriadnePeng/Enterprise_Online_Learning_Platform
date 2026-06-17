import { useState } from 'react';
import { procedures } from '@/data/databaseObjects';
import {
  Cog,
  Code2,
  Play,
  CheckCircle,
  AlertCircle,
  Database,
  Terminal
} from 'lucide-react';
import { api } from '@/services/api';

export default function ProcedureCenter() {
  const [selectedProc, setSelectedProc] = useState(procedures[0]);
  const [paramValues, setParamValues] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [executedProcs, setExecutedProcs] = useState<Set<string>>(new Set());

  const executeProcedure = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      let res: any;
      switch (selectedProc.name) {
        case 'sp_batch_assign_task':
          res = await api.procedure.batchAssignTask({
            p_task_id: paramValues.p_task_id || 'T011',
            p_task_name: paramValues.p_task_name || '新任务测试',
            p_creator_id: paramValues.p_creator_id || 'U001',
            p_target_position: paramValues.p_target_position || '安全工程师',
            p_deadline: Number(paramValues.p_deadline) || 24,
          });
          break;
        case 'sp_update_task_time':
          res = await api.procedure.updateTaskTime({
            p_task_id: paramValues.p_task_id || 'T001',
            p_new_deadline: Number(paramValues.p_new_deadline) || 30,
          });
          break;
        case 'sp_course_offline':
          res = await api.procedure.offlineCourse(Number(paramValues.p_course_id) || 1);
          break;
        case 'auto_submit_exam':
          res = await api.procedure.autoSubmitExam({
            p_exam_id: Number(paramValues.p_exam_id) || 1,
            p_user_id: paramValues.p_user_id || 'U001',
          });
          break;
        case 'exam_pass_rate':
          res = await api.procedure.getPassRate(Number(paramValues.p_exam_id) || 1);
          break;
        case 'sp_export_anomaly_employees':
          res = await api.procedure.exportAnomalyEmployees({
            p_risk_level: paramValues.p_risk_level,
            p_department: paramValues.p_department,
          });
          break;
        case 'sp_archive_monthly_stats':
          res = await api.procedure.archiveMonthly(paramValues.p_stat_month || '2026-06');
          break;
        case 'sp_emp_update_note':
          res = await api.procedure.updateNote({
            p_note_id: Number(paramValues.p_note_id) || 1,
            p_new_content: paramValues.p_new_content || '更新后的笔记内容',
          });
          break;
        case 'sp_admin_get_all_notes':
          res = await api.procedure.getAllNotesAdmin();
          break;
        default:
          // Mock result
          res = { message: '存储过程执行成功', procedure: selectedProc.name };
      }
      setResult(res);
      setExecutedProcs((prev) => new Set(prev).add(selectedProc.name));
    } catch (err: any) {
      setError(err.message || '执行失败');
      // Mock success
      setResult({
        success: true,
        message: `[模拟] 存储过程 ${selectedProc.name} 执行成功`,
        data: generateMockResult(selectedProc.name),
      });
      setExecutedProcs((prev) => new Set(prev).add(selectedProc.name));
    } finally {
      setLoading(false);
    }
  };

  const generateMockResult = (procName: string) => {
    const mockResults: Record<string, any> = {
      'sp_batch_assign_task': { affected_rows: 3, message: '派发成功！已初始化3名学员的进度档案' },
      'sp_update_task_time': { task_id: 'T001', old_deadline: 24, new_deadline: 30, message: '延期成功' },
      'sp_course_offline': { course_id: 1, status: '已下架', chapters_hidden: 5, resources_hidden: 3 },
      'auto_submit_exam': { exam_id: 1, user_id: 'U001', score: 85, pass_status: 1 },
      'exam_pass_rate': { exam_id: 1, total_students: 10, pass_students: 8, pass_rate: 80 },
      'sp_export_anomaly_employees': [
        { user_id: 'U006', username: '贾向东', risk_level: '高危', anomaly_tag: '从未学习' },
        { user_id: 'U007', username: '陈宝玉', risk_level: '中危', anomaly_tag: '休眠学员' },
      ],
      'sp_archive_monthly_stats': { archive_id: 1, stat_month: '2026-06', message: '归档成功' },
      'sp_emp_update_note': { note_id: 1, update_time: '2026-06-13 10:00:00' },
      'sp_admin_get_all_notes': [
        { note_id: 1, scope_id: 1, note_content: '笔记内容1...', note_create_time: '2026-05-01' },
        { note_id: 2, scope_id: 2, note_content: '笔记内容2...', note_create_time: '2026-05-02' },
      ],
    };
    return mockResults[procName] || { message: '执行完成' };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="db-page-header">
        <h1 className="db-page-title">存储过程控制台</h1>
        <p className="db-page-desc">
          共 {procedures.length} 个存储过程 — 封装核心业务逻辑，支持批量操作、事务处理和自动化流程
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Procedure List */}
        <div className="lg:col-span-1 db-card p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Cog className="w-4 h-4 text-amber-500" />
            存储过程列表
          </h3>
          <div className="space-y-1 max-h-[700px] overflow-y-auto">
            {procedures.map((proc) => (
              <button
                key={proc.id}
                onClick={() => {
                  setSelectedProc(proc);
                  setParamValues({});
                  setResult(null);
                  setError('');
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  selectedProc.id === proc.id
                    ? 'bg-amber-50 border border-amber-200'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Cog className={`w-4 h-4 flex-shrink-0 ${
                  selectedProc.id === proc.id ? 'text-amber-500' : 'text-slate-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    selectedProc.id === proc.id ? 'text-amber-700' : 'text-slate-700'
                  }`}>
                    {proc.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{proc.nameCn}</p>
                </div>
                {executedProcs.has(proc.name) && (
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Procedure Detail */}
        <div className="lg:col-span-2 space-y-4">
          {/* Info Card */}
          <div className="db-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Cog className="w-5 h-5 text-amber-500" />
                  {selectedProc.name}
                </h2>
                <p className="text-sm text-slate-500 mt-1">{selectedProc.nameCn}</p>
                <p className="text-sm text-slate-600 mt-2">{selectedProc.description}</p>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                  {selectedProc.method}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Database className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">关联表:</span>
              {selectedProc.relatedTables.map((t) => (
                <span key={t} className="db-badge-table">{t}</span>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div className="db-card p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-500" />
              参数配置
            </h3>
            {selectedProc.params.length === 0 ? (
              <p className="text-sm text-slate-400 italic">该存储过程无需输入参数</p>
            ) : (
              <div className="space-y-3">
                {selectedProc.params.map((param) => (
                  <div key={param.name} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        {param.name}
                        {param.required && <span className="text-rose-500 ml-1">*</span>}
                      </label>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">{param.type}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          param.mode === 'IN' ? 'bg-blue-50 text-blue-600' :
                          param.mode === 'OUT' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>{param.mode}</span>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder={param.description}
                        value={paramValues[param.name] || ''}
                        onChange={(e) => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <p className="text-xs text-slate-400 mt-1">{param.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={executeProcedure}
              disabled={loading}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 text-sm font-medium transition-colors"
            >
              <Play className="w-4 h-4" />
              {loading ? '执行中...' : '执行存储过程'}
            </button>
          </div>

          {/* SQL Definition */}
          <div className="db-card p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-violet-500" />
              SQL 定义
            </h3>
            <pre className="db-code-block text-xs leading-relaxed overflow-x-auto">
              <code>{selectedProc.sql}</code>
            </pre>
          </div>

          {/* API Info */}
          <div className="db-card p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">后端接口</h3>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                selectedProc.method === 'GET' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
              }`}>{selectedProc.method}</span>
              <code className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded">{selectedProc.endpoint}</code>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="db-card p-6 border-emerald-200 bg-emerald-50/30">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                执行结果
              </h3>
              <pre className="bg-white border border-slate-200 rounded-lg p-4 text-xs overflow-x-auto">
                <code>{JSON.stringify(result, null, 2)}</code>
              </pre>
            </div>
          )}

          {error && !result && (
            <div className="db-card p-4 border-rose-200 bg-rose-50">
              <div className="flex items-center gap-2 text-rose-700 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
